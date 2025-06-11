import ChannelCarousel from '@/components/channel/ChannelCarousel'
import EducationLevelSelector from '@/components/channel/EducationLevelSelector'
import ChannelManagement from '@/components/channel/ChannelManagement'
import TeacherChannelManagement from '@/components/channel/TeacherChannelManagement'
import { prisma } from '@/lib/db'
import React from 'react'
import { auth } from '@/app/authhandlers/auth'

export default async function page() {

  const session = await auth()
  
  const sessionUser = session?.user

  const user = await prisma.user.findUnique({
    where:{
      email:sessionUser.email as string
    },
    include:{
      channels:true
    }
  })

  if(!user){
    return
  }

  const [educationLevels, channel, featuredChannels ] = await prisma.$transaction([

    prisma.educationLevel.findMany({
      include:{
        classes:{
          include:{
            subjects:true
          }
        }
      }
    }),

    prisma.channel.findFirst({
      where:{
        userId:user?.id
      }
    }),

  prisma.channel.findMany({
    where:{
      isFeatured:true
    },
    include:{
      user:true
    }
    
  })
  ])



  return (
    <div className='min-h-screen bg-gray-50'>
      {featuredChannels.length > 0 && <ChannelCarousel channels={featuredChannels} />}
      <TeacherChannelManagement />
      <ChannelManagement user={user} />
     {user.channels.length > 0 &&
      <EducationLevelSelector educationLevels ={ educationLevels} channel={channel?.id as string} />
      }
    </div>
  )
}
