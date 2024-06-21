import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "../../libs/prismadb";
import { NextResponse } from "next/server";
import { getUsers } from "@/app/actions/getUsers";
import { User } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const { image, name } = await request.json();
    const currentUser = await getCurrentUser();

    if (!currentUser?.email || !currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Please Provide Valid Name", { status: 401 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },

      data: {
        name: name,
        image: image,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (e) {
    return new NextResponse("Internal Error");
  }
}
