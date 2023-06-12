import { Message } from '@prisma/client';
import prisma from "../libs/prismadb"

export async function getMessages(id : string) {
    const messages = await prisma.message.findMany({
        where : {
            conversationId : id
        },
        include : {
            seen : true,
            sender : true
        },
        orderBy : {
            createdAt : "asc"
        }
    })

    return messages
}