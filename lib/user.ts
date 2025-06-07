"server only"
import { auth } from "@/app/authhandlers/auth"
import { prisma } from "./db"
import { redirect } from "next/navigation"

export const getUser = async () =>{
  try {
    const session = await auth()

    const sessionUser = session?.user

    if(!sessionUser){
      redirect('/signin')
    }

    const user = await prisma.user.findUnique({
      where:{
        email:sessionUser.email as string
      },
    })

    return user
    

   
  } catch (error) {
    console.log(error)
    throw new Error('No user found')
  }
}