import { getCurrentUser } from "@/app/actions/getCurrentUser"
import prisma from "../../libs/prismadb"
import { NextResponse} from "next/server"
import { data } from "autoprefixer";
import { pusherServer } from "@/app/libs/pusher";
import { getUsers } from "@/app/actions/getUsers";
import { User } from "@prisma/client";

export async function POST(request : Request) {
    try {
        const { image, name } = await request.json()
        const currentUser = await getCurrentUser();

        if (!currentUser?.email || !currentUser?.id) {
            return new NextResponse("Unauthorized", {status : 401})
        }

        if (!name) {
            return new NextResponse("Please Provide Valid Name", {status : 401})
        }

        const updatedUser = await prisma.user.update({
            where : {
                id : currentUser.id
            },

            data : {
                name : name,
                image : image
            }
        });

        const usersInContact : User[] = await getUsers();
        usersInContact.map((user) => {
            pusherServer.trigger(user?.email!, "user:update", {
                id : updatedUser.id,
                name : updatedUser.name,
                image : updatedUser.image
            })
        });
        await pusherServer.trigger(currentUser?.email!, "user:update", {
            id : updatedUser.id,
            name : updatedUser.name,
            image : updatedUser.image
        })

        return NextResponse.json(updatedUser);
    }
    catch(e) {
        return new NextResponse("Internal Error")
    }
}