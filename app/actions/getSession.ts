import { getServerSession } from "next-auth";

import { authOptions } from "../api/auth/[...nextauth]/route";

export async function getSession(){
    const session = await getServerSession(authOptions);

    return session
}