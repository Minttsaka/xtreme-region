
import { auth } from '@/app/authhandlers/auth'
import WelcomeNewSignup from '@/components/dashboard/Welcome'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function page() {

  const session = await auth()
  
  if (!session?.user?.email) {
    redirect("/signin")
  }
  
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email
    }
  })
 

  return (
    <div className='bg-gray-100'>   
      <div>
        <WelcomeNewSignup user={user} />
      </div>
      {/* <DashboardFooter /> */}
    </div>
  )
}
