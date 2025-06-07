import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import Google from "next-auth/providers/google"
import { authConfig } from "./auth.config"
import bcrypt from "bcryptjs";

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Google,
    Credentials({
      name: "Credentials",
      credentials: {
        username: {
          label: "User Name",
          type: "text",
          placeholder: "Your User Name",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials: Partial<Record<"email" | "password", unknown>>) {
        try {

  
          const user = await prisma.user.findUnique({
              where: {

                email: credentials.email as string,

              },
            })
          
            if (!user) throw new Error("The email does not exist")
          
            if (!credentials?.password) throw new Error("Please provide your password")
          
            const isPasswordCorrect =  bcrypt.compareSync(credentials.password as string, user.password as string)
          
            if (!isPasswordCorrect) throw new Error("The password is not correct")
          
            if (!user.emailVerified) throw new Error("Please verify your email first! using the link sent to your email!")
          
            const { password , ...userWithoutPass } = user

            if(!password){
              throw new Error("no pass")
            }
          
            return userWithoutPass

        } catch (error) {
          throw error
        }
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
})

