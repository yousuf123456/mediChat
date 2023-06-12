import { User } from "@prisma/client";
import prisma from "../libs/prismadb"
import { getCurrentUser } from "./getCurrentUser"


export const getUsers = async ()=>{
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
            users : true
        }
    });

    const users = conversations.map((conversation)=>{
        const conversationUsers = conversation.users
        const otherUser = conversationUsers.filter((user)=> user.email !== currentUser.email)

        return otherUser;
    });

    const flattenedArrayUsers = users.flat();
    const uniqueUsers = Array.from(new Set(flattenedArrayUsers.map((user)=>JSON.stringify(user)))).map((user)=>JSON.parse(user));

    return uniqueUsers;
}