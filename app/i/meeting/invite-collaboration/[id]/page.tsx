import { auth } from '@/app/authhandlers/auth'
import { InvitationDetails } from '@/components/meeting/agenda/InvitationDetails'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function page({
  params
}: {
  params:  Promise<{ id: string }>
}) {

  const id = (await params).id


  const session = await auth()
  
  if (!session?.user?.email) {
    redirect("/signin")
  }
  
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email
    }
  })
 

  const meeting = await prisma.meeting.findUnique({
        where:{
          id
        },
        include:{
          collaborators:{
            include:{
              user:true
            }
          }
        }
      })
  

  if(!meeting){
    redirect('/meeting')
  }

  if(!user){
    redirect('/meeting')
  }

  return (
    <div>
      <InvitationDetails meeting={meeting} userId={user.id} />
    </div>
  )
}
