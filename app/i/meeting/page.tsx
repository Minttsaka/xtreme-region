
import { auth } from '@/app/authhandlers/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import React from 'react'
import { CalMeetDashboard } from '@/components/meeting/CalMeetDashboard'
import MeetingBoard from '@/components/meeting/MeetingBoard'

export default async function page() {

    const session = await auth()
    
    if (!session?.user) redirect('/signin')

      const [user ] =  await  prisma.$transaction([

        prisma.user.findUnique({
          where:{
            email: session?.user?.email as string
          },
          include:{
            meetings:{
              include:{
                files:true,
                host:true,
                participants:{
                  include:{
                    user:true
                  }
                }
              }
            }
          }
        }),
      ])

       const collaborations = await  prisma.collaborators.findMany({
        where:{
          userId:user?.id
        },
        include:{
          meeting:{
            include: {
              files: true,
              host: true,
              participants:{
                include:{
                  user:true
                }
              }
            }
          }
        }
      })

      const participated = await prisma.participants.findMany({
        where:{
          userId:user?.id
        },
        include:{
          meeting:{
            include:{
              files:true,
              host:true,
              participants:{
                include:{
                  user:true
                }
              }
            }
          }
        }
      })


      if(!participated || !collaborations) {
        redirect('/signin')
      }
  
   
  
    if(!user) {
      redirect('/signin')
    }

  return (

    <div>
      <MeetingBoard />
      <CalMeetDashboard 
        meetings={user?.meetings} 
        collaborations={collaborations} 
        participated={participated} 
      />      
    </div>
  )
}
