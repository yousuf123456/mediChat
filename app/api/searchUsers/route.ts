import { auth, clerkClient } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId : currentUserId } = auth();

    if (!currentUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { email_id } = await req.json();

    const { data } = await clerkClient.users.getUserList({
      query: email_id,
      limit: 10,
    });

    return NextResponse.json(
      data.map((user) => ({
        emailAddress: user.emailAddresses[0]!.emailAddress,
        imageUrl: user.imageUrl,
        id: user.id,
      })).filter((user)=> user.id !== currentUserId)
    );
  } catch (e) {
    console.log(e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
