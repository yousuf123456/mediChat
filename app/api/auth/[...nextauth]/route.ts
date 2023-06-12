import bcrypt from "bcrypt"
import NextAuth, {AuthOptions} from "next-auth"

import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"

import { PrismaAdapter } from "@next-auth/prisma-adapter"

import prisma from "../../../libs/prismadb"

export const authOptions : AuthOptions = {
    adapter : PrismaAdapter(prisma),
    providers : [
        GithubProvider({
            clientId : process.env.GITHUB_ID as string,
            clientSecret : process.env.GITHUB_SECRET as string,
        }),

        GoogleProvider({
            clientId : process.env.GOOGLE_ID as string,
            clientSecret : process.env.GOOGLE_SECRET as string,
        }),

        CredentialsProvider({
            name : "credentials",
            credentials : {
                email : {label : "Email", type : "text"},
                password : {label : "Password", type : "password"}
            },

            async authorize(credentials) {
                const {email, password} = credentials as {email : string, password : string};

                if (!email || !password) throw new Error("Incomplete Credentials");
                
                const user = await prisma.user.findUnique({
                    where : {
                        email : email,
                    }
                })

                if (!user) throw new Error("Invalid Credentials");

                if (!user.hashedPassword) throw new Error("Invalid Credentials");

                const passwordIsCorrect = await bcrypt.compare(password, user.hashedPassword);

                if (!passwordIsCorrect) throw new Error("Invalid Credentials");

                return user;
            }
        })
    ],

    debug : process.env.NODE_ENV === "development",

    session : {
        strategy : "jwt"
    },

    secret : process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST}
