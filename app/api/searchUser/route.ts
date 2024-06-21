import { NextResponse } from "next/server";
import prisma from "../../libs/prismadb";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { email_id } = body;

    const currentUser = await getCurrentUser();
    if (!currentUser?.email) {
      return new NextResponse("User Not Authorized", { status: 401 });
    }

    if (!email_id) {
      return new NextResponse("Please Provide Email or Id to Search User", {
        status: 401,
      });
    }

    if (email_id === currentUser.id || email_id === currentUser.email) {
      if (!currentUser?.email) {
        return new NextResponse("Cannot Add Your Own Account", { status: 401 });
      }
    }

    const isValidId = ObjectId.isValid(email_id);

    const user = await prisma.user.findMany({
      where: {
        OR: {
          email: email_id,
          ...(isValidId ? { id: email_id } : {}),
        },
      },
    });

    if (!user[0]) {
      return new NextResponse("Invalid Email/Id", { status: 401 });
    }

    return NextResponse.json(user[0]);
  } catch (e) {
    console.log(e);
  }
}
