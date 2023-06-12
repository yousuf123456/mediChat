import { User } from "@prisma/client"
import prisma from "../../libs/prismadb"
import { getSession } from "@/app/actions/getSession"
import { NextResponse } from "next/server"
import { setEmitFlags } from "typescript";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { pusherServer } from "@/app/libs/pusher";


export async function POST(request : Request){

    try {
        const body = await request.json();

        const { user, isGroup, name, members } = body

        if ( !isGroup && !user ) {
            return new NextResponse("Please Provide A User to Create Conversation", {status : 401})
        }

        if (isGroup && ( !(members.length > 2)  && !name )) {
            return new NextResponse("Please Provide More Than Two Users to Create a Group", {status : 401})
        }

        const currentUser = await getCurrentUser()

        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse("User Not Authorized", {status : 401})
        }

        if(!isGroup) { 
            const exitingConversations = await prisma.conversation.findMany({
                where : {
                    OR : [
                    {
                        userIds : { equals : [user.id, currentUser.id]} 
                    },
                    {
                        userIds : { equals : [currentUser.id, user.id]} 
                    }
                ]
                }
            })
            const singleConversation = exitingConversations[0]

            if(singleConversation) {
                return NextResponse.json(singleConversation)
            }

            const newConversation = await prisma.conversation.create({
                data : {
                    isGroup : isGroup,
                    users : { 
                        connect : 
                        [
                            {
                                id : user.id
                            },
                            {
                                id : currentUser.id
                            }
                        ]
                    }
                },

                include : {
                    users : true,
                    messages : {
                        include : {
                            seen : true
                        }
                    }
                }
            })

            newConversation.users.map((user) => {
                if (user.email) {
                    pusherServer.trigger(user.email, "conversation:new", newConversation)
                }
            })
            
            return NextResponse.json(newConversation)
        }

        if(isGroup) {
            const groupConversation = await prisma.conversation.create({
                data : {
                    isGroup : isGroup,
                    name : name,
                    users : { 
                        connect : [
                            ...members.map((member : User) => ( { email : member.email })),
                            { email : currentUser.email }
                        ],
                    }
                },

                include : {
                    users : true,
                    messages : {
                        include : {
                            seen : true
                        }
                    }
                }
            })

            groupConversation.users.map((user) => {
                if (user.email) {
                    pusherServer.trigger(user.email, "conversation:new", groupConversation)
                }
            })

            return NextResponse.json(groupConversation);
        }
    } 
    
    catch (e) {
        return new NextResponse("Internal Error", {status : 400})
    }
}