import { api } from "@/convex/_generated/api";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { ConvexClient } from "convex/browser";

import { NextResponse } from "next/server";

const convex = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: Request) {
  try {
    const { conversationId, userId } = await request.json();

    const user = await currentUser();

    if (!user && !userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const userIds = await convex.query(api.conversation.getOtherUserIds, {
      conversationId,
      currentUserId: user?.id || userId,
    });

    const users = await clerkClient.users.getUserList({
      userId: userIds,
    });

    return NextResponse.json(users.data);
  } catch (e) {
    console.log(e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
