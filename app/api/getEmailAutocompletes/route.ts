import prisma from "@/app/libs/prismadb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { email } = await req.json();

    const pipeline = [
      {
        $search: {
          index: "autocomplete",
          autocomplete: {
            query: email,
            path: "email",
            fuzzy: {},
          },
        },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          email: 1,
        },
      },
    ];

    let autocompletesData = (await prisma.user.aggregateRaw({
      pipeline: pipeline,
    })) as any;

    autocompletesData = autocompletesData?.filter(
      (data: { email: string }) => data.email !== session.user?.email
    );

    return NextResponse.json(autocompletesData);
  } catch (e) {
    console.log(e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
