import prisma from "../libs/prismadb"
import { getSession } from "./getSession"

export async function getCurrentUser() {

    const session = await getSession();

    const email = session?.user?.email

    if (!email) return null
    
    const user = await prisma.user.findUnique({
        where : {
            email : email
        }
    })

    if (!user || !user?.email) {
        return null
    }

    return user;
}

