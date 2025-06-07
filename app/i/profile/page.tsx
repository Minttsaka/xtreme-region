
import { auth } from '@/app/authhandlers/auth'
import ProfilePage from '@/components/profiile/ProfilePage'
import { prisma } from '@/lib/db'
import React from 'react'

export default async function page() {

  const session = await auth()  
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email
    },
     include: {
      staff: {
        include: {
          school: true
        }
      },
      completeArena: true,
      _count: {
        select: {
          channels: true,
          meetings: true,
        }
      }
    }
  })
 

  if (!user) {
    return <div className="text-center text-red-500">You must be logged in to view this page.</div>
  }


  return (
    <div className='bg-gray-100 min-h-screen'>
      <ProfilePage user={user} />
    </div>
  )
}
