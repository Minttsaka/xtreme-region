import { auth } from '@/app/authhandlers/auth'
import { AgendaCreator } from '@/components/meeting/agenda/AgendaCreator'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function page(
  {
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
          where:{
            status:"accepted"
          },
          include:{
            user:true
          }
        }
      }
    })

    if(!meeting){
      redirect('/i/meeting')
    }
    

    const currentUser = await prisma.user.findUnique({
      where:{
        id:user?.id
      },
      include:{
    channels:{
      include:{
        courses:{
          include:{
            lessons:true,
            course:{
              include:{
                subject:true
              }
            }
          }
        }
      }
    },
    meetings:{
      include:{
        files:true
      }
    }
  }
    })

    if(!currentUser){
      redirect('/i/meeting')
    }

  return (
    <div className='bg-gray-50'>
        <AgendaCreator meeting={meeting} user = {currentUser} />
    </div>
  )
}
