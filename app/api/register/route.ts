import bcrypt from "bcrypt";
import prisma from "../../libs/prismadb";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const { name, email, password } = data;

    if (!name || !email || !password) {
      return new NextResponse("Incomplete Credentials !", { status: 400 });
    }

    const usersExist = await prisma.user.findMany({
      where: {
        email: email,
      },
    });

    if (usersExist?.length) {
      return new NextResponse("Email Already Taken !", { status: 400 });
    }

    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds);

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        hashedPassword: hashedPassword,
      },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (e: any) {
    console.log(e);
  }
}
