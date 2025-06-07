import { auth } from "@/app/authhandlers/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()

    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: {
          email: session.user.email
        },
        include:{
          completeArena:{
            include:{
              course:true,
              lesson:true,
            }
          }
        }
      })

      if (user) {
        const { password, ...safeUser } = user
        return NextResponse.json({ user: safeUser })
      }

      // Authenticated but user not found in DB
      return NextResponse.json({ user: null })
    }

    // Unauthenticated request
    return NextResponse.json({ user: null })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
