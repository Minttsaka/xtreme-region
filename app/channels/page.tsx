
import { ChannelsPage } from '@/components/channelpage/ChannelPage'
import EnhancedFooter from '@/components/landing/footer/EnhancedFooter'
import NavBar from '@/components/landing/nav/NavBar'
import { prisma } from '@/lib/db'
import React from 'react'

export default async function page() {

  const [channels, lessons ] = await prisma.$transaction([
    prisma.channel.findMany({
      where:{
        isActive:true
      },
        select: {
          createdAt: true,
          name: true,
          isFeatured:true,
          courses:true,
          thumbnail:true,
          rating:true,
          subscriptions:true,
          description: true,
          id: true,
          user:true,
        _count: {
          select: {
            courses: true,
            subscriptions:true,
            likes:true,
            rating:true,
          },
        },
      },
  }),
    prisma.lesson.findMany({
      where:{
        approvalStatus:"APPROVED"
      },
      select: {
        price:true,
        id:true,
        title:true,
        thumbnail:true,
        rating:true,
        accessLevel:true,
        user:true,
        course:{
          select:{
            id:true,
            channel:true
          }
        },
        duration:true,
        createdAt:true,
        _count: {
          select: {
            views: true,
            rating:true
          },
        },
      },
   
    })
  ])

  return (
    <div>
       <NavBar />
      <ChannelsPage 
        channels={channels} 
        lessons={lessons} 
      />
      <EnhancedFooter />
    </div>
  )
}
