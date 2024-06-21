import { getCurrentUser } from "@/app/actions/getCurrentUser";
import prisma from "../../libs/prismadb";
import { NextResponse } from "next/server";
import { User } from "@prisma/client";
import { find } from "lodash";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { message, conversationId, image } = body;

    const currentUser = await getCurrentUser();

    if (!currentUser?.email || !currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const createdMessage = await prisma.message.create({
      data: {
        body: message,
        image: image,

        conversation: {
          connect: {
            id: conversationId,
          },
        },

        sender: {
          connect: {
            id: currentUser.id,
          },
        },

        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },

      include: {
        seen: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        sender: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    console.log("I am here stuck");
    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },

      data: {
        lastMessagedAt: new Date(),
        messages: {
          connect: {
            id: createdMessage.id,
          },
        },
      },

      include: {
        users: true,
        messages: {
          include: {
            seen: {
              select: {
                name: true,
                image: true,
                email: true,
              },
            },
          },
        },
      },
    });

    const lastMessage =
      updatedConversation.messages[updatedConversation.messages.length - 1];
    if (!lastMessage) {
      return NextResponse.json(updatedConversation);
    }

    updatedConversation.users.map((user: User) => {
      let fakeSeenMessages = [];
      for (let i = updatedConversation.messages.length - 1; i >= 0; i--) {
        const message = updatedConversation.messages[i];
        if (find(message.seen, { email: user.email })) {
          break;
        }

        fakeSeenMessages.push({});
      }

      fakeSeenMessages.pop();
    });

    return NextResponse.json(createdMessage);
  } catch (e) {
    console.log(e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
