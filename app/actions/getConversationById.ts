import prisma from "../libs/prismadb"
import { getCurrentUser } from "./getCurrentUser"

export async function getConversationById(id : string) {
    const currentUser = await getCurrentUser();

    if (!currentUser?.email) {
        return null
    }

    const conversation = await prisma.conversation.findUnique({
        where : {
            id : id
        },

        include : {
            users : true
        }
    })

    const currentUserIsMember = conversation?.users.filter((user) => user.email === currentUser.email).length !== 0;
    if (!currentUserIsMember) {
        return null
    }

    return conversation;
}