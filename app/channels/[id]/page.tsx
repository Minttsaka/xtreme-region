

import ChannelPage from '@/components/channelpage/SIngleChannelPage'
import EnhancedFooter from '@/components/landing/footer/EnhancedFooter'
import NavBar from '@/components/landing/nav/NavBar'
import { prisma } from '@/lib/db'
import React from 'react'

export default async function page(
   {
    params
  }: {
    params:  Promise<{ id: string }>
  }
) {

  const id = (await params).id
  const channel = await prisma.channel.findUnique({
  where: {
    id,
  },
  include:{
    likes:true,
    views:true,
    subscriptions:true,
    rating:true,
      courses:{
        where:{
          approvalStatus:"APPROVED"
        },
        include:{
          lessons:{
            include:{
              resources:{
                include:{
                  resource:true
                }
              }
            }
          },
          subjectToClass:{
            include:{
              subject:true,
              class:true
            }
          }
        }
      },
      user:true,
      _count:{
        select:{
          subscriptions:true,
          courses:true,
          likes:true,
          views:true,
          rating:true
        }
      }
    }
});

  if(!channel) {
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='text-2xl font-bold'>Channel not found</h1>
        <p className='text-gray-500'>The channel you are looking for does not exist.</p>
        <p className='text-gray-500'>Please check the URL and try again.</p>
      </div>
    )
  }

  return (
    <div className='bg-gray-100 min-h-screen space-y-10'>
       <NavBar />
      <ChannelPage 
        channel={channel} />
      <EnhancedFooter />
    </div>
  )
}
