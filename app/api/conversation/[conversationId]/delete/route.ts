import { Conversation } from "@prisma/client";
import prisma from "../../../../libs/prismadb";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

interface IParams {
  conversationId: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const { conversationId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.email || !currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },

      include: {
        users: true,
      },
    });

    if (!existingConversation) {
      return new NextResponse("Invalid Conversation Id", { status: 401 });
    }

    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          has: currentUser.id,
        },
      },
    });

    if (!deletedConversation) {
      return new NextResponse(
        "Action Taker Does Not Belong To This Conversation",
        { status: 401 }
      );
    }

    return NextResponse.json(deletedConversation);
  } catch (e) {
    return new NextResponse("Internal Error", { status: 400 });
  }
}
