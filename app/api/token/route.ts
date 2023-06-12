import { getCurrentUser } from "@/app/actions/getCurrentUser"
import prisma from "../../libs/prismadb"
import { NextResponse } from "next/server"

export async function POST(request : Request) {
    try {
        const { token, notificationPermission } = await request.json();

        const currentUser = await getCurrentUser();
        if (!currentUser?.email || !currentUser.id) {
            return new NextResponse("Unauthorized", { status : 401 })
        }

        const permission = notificationPermission === "granted";

        const updatedUser = await prisma.user.update({
            where : {
                email : currentUser.email
            },

            data : {
                ...(!token ? {} : { deviceToken: token }),
                notificationPermission : permission
            }
        });

        return NextResponse.json(updatedUser);
    }
    catch (e){
        return new NextResponse("Internal Server Error", { status : 400 })
    }
}