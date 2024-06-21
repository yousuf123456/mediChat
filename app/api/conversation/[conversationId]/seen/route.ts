import { EmptyState } from "@/app/(site)/components/EmptyState";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "../../../../libs/prismadb";
import { NextResponse } from "next/server";
import { find } from "lodash";

interface IParams {
  conversationId: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const { conversationId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.email || !currentUser.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },

      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });

    const lastMessage =
      existingConversation?.messages[existingConversation.messages.length - 1];

    if (!lastMessage) {
      return NextResponse.json(existingConversation);
    }

    if (find(lastMessage.seen, { id: currentUser.id })) {
      return NextResponse.json(lastMessage);
    }

    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id,
      },

      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },

      include: {
        seen: true,
        sender: true,
      },
    });

    return NextResponse.json(updatedMessage);
  } catch (e) {
    console.log(e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
