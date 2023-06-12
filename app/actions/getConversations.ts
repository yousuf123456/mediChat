import { NextResponse } from "next/server";
import prisma from "../libs/prismadb"
import { getCurrentUser } from "./getCurrentUser"

export async function getConversations(){
    try {
        const currentUser = await getCurrentUser();
    
        if (!currentUser?.email || !currentUser?.id) {
            return []
        }
    
        const conversations = await prisma.conversation.findMany({
            where : {
                userIds : {
                    has : currentUser.id
                }
            },
    
            include : {
                users : true,
                messages : {
                    include : {
                        seen : true,
                        sender : true
                    }
                }
            }
            
        })
    
        return conversations || [];
    }

    catch (e) {
        console.log(e);
    }
}