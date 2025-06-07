
import CoursePage from '@/components/channelpage/CoursePage'
import Announcements from '@/components/course/Announcements'
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
  const course = await prisma.userCourse.findUnique({
    where:{
      id
    },
     include:{
    rating:true,
    enrollment:true,
    completeArena:true,
    notification:{
      include:{
        author:true,
      },
      orderBy:{
        createdAt:'desc'
      }
    },
    review:{
      include:{
        user:true,
        reviewLike:true
      }
    },
    likes:true,
    views:true,
    channel:{
      select:{
        user:true,
      }
    },
    lessons:{
      include:{
        rating:true,
        resources:{
          include:{
            resource:true
          }
        },
        _count:{
          select:{
            views:true
          }
        }
      }
    },
    subjectToClass:{
      include:{
        subject:true,
        class:true
      }
    },
    _count:{
      select:{
        likes:true,
        views:true,
        rating:true
      }
    }
  }

  })
  if(!course) {
    throw new Error("Course not found")
  }

  return (
    <div>
       <NavBar />
     {course.notification.length > 0 && <Announcements announcement={course.notification[0]} />}
      <CoursePage course={course} />
      <EnhancedFooter />
    </div>
  )
}
