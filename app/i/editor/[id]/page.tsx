
import { auth } from '@/app/authhandlers/auth'
import CourseEditor from '@/components/lesson-editor/CourseEditor'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function page(
  {
    params
  }: {
    params:  Promise<{ id: string }>
  }
) {

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
   

  const lesson = await prisma.lesson.findUnique({
    where:{
      id
    },
    include:{
      slides:{
        include:{
          theme:true,
          notes:{
            include:{
              highlight:true
            }
          }
        }
      },
      course:{
        include:{
          subjectToClass:{
            include:{
              subject:true
            }
          }
        }
      },
      resources:{
        include:{
          resource:{
            include:{
              authors:true
            }
          }
        }
      }
    }
  })

  if(!lesson){
    redirect('/channel')
  }

  if(!user){
    redirect('/channel')
  }

  return (
    <div className='h-screen'>
      <div className='bg-gray-100 h-full'>
        <CourseEditor 
          lesson={lesson} 
          user = {user}
        />
      </div>
      </div>
  )
}
