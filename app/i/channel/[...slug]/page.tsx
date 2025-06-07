import { auth } from '@/app/authhandlers/auth'
import AdorableLessonManager from '@/components/channel/AdorableLessonManager'
import { prisma } from '@/lib/db'
import React from 'react'

export default async function page(
  {
    params
  }: {
    params:  Promise<{ slug: string[] }>
  }
) {

  const [classId, channel] = (await params).slug

  const subjectsForPrimary = await prisma.subjectToClass.findMany(
    {
      where:{
        classId
      },
      include:{
        courses:{
          include:{
            userCourse:true
          }
        },
        subject:{
          include:{
            resource:{
              include:{
                subject:true,
                resource:{
                  include:{
                    authors:true,
                  }
                }
              }
            },
            
          }
        }
      }
    }
  )

    const session = await auth()
    
    const sessionUser = session?.user
  
    const user = await prisma.user.findUnique({
      where:{
        email:sessionUser?.email as string
      },
      include:{
        completeArena:{
          select:{
            id:true,
          }
        }
      }
    })
  

  const collaboratedCourses = await prisma.collaborators.findMany({
    where:{
      userId:user?.id,
      type:"COURSE"
    },
    include:{
      course:{
        include: {
          review:{
            include:{
              user:true,
              reviewLike:true
            }
          },
          course: true,
          enrollment:{
            include:{
              user:{
                  include:{
                      completeArena:true
                  }
              }
            }
          },
          notification:true,
          lessons:{
            include:{
              resources:{
                include:{
                  resource:true
                }
              }
            }
          }
        },
      }
    }
  }) 
  
  return (
    <div>
      <AdorableLessonManager 
      collaboratedCourses={collaboratedCourses}
      user={user}
      subjects={subjectsForPrimary} 
      channel={channel} 
      />
    </div>
  )
}
