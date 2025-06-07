
import { auth } from "@/app/authhandlers/auth"
import LessonViewer from "@/components/lesson/ModeLessonViewer"
import { prisma } from "@/lib/db"

export default async function page({
  params
}: {
  params: Promise<{ slug: string[] }>
}) {
  const [lessonId, courseId] = (await params).slug

  // Handle authentication first
  const session = await auth()
  const sessionUser = session?.user
  
  const userId = sessionUser?.id


  // Fetch all data in a single transaction with user-specific progress
  const [lesson, course, user] = await prisma.$transaction([
    // Lesson with slides and their completion status
    prisma.lesson.findUnique({
      where: {
        id: lessonId
      },
      include: {
        finalSlide: {
          include: {
            notes: true,
            completeArena: {
              where: {
                type: "SLIDE",
                ...(userId && { userId }) // Only include user's progress if authenticated
              },
              include: {
                user: true
              }
            }
          }
        },
        user: true,
        completeArena: {
          where: {
            type: "LESSON",
            ...(userId && { userId }) // Only include user's progress if authenticated
          },
          include: {
            user: true,
            finalSlide:true
          }
        },
        resources: {
          include: {
            resource: true
          }
        }
      }
    }),

    // Course with lessons and completion status
    prisma.userCourse.findUnique({
      where: {
        id: courseId
      },
      include: {
        lessons: {
          include: {
            completeArena: {
              where: {
                type: "LESSON",
                ...(userId && { userId }) // Only include user's progress if authenticated
              }
            }
          }
        },
        enrollment: true,
        completeArena: {
          where: {
            OR: [
              { type: "LESSON" },
              { type: "COURSE" }
            ],
            ...(userId && { userId }) // Only include user's progress if authenticated
          },
          include: {
            lesson: true,
            course: true
          }
        }
      }
    }),

    // User with all their completion data (only if authenticated)
    prisma.user.findUnique({
      where: {
        id: userId
      },
      include: {
        completeArena: {
          where: {
            OR: [
              { 
                type: "SLIDE",
                finalSlide: {
                  lessonId: lessonId
                }
              },
              { 
                type: "LESSON",
                lesson: {
                  courseId: courseId
                }
              },
              { 
                type: "COURSE",
                courseId: courseId
              }
            ]
          },
          include: {
            course: true,
            lesson: true,
            finalSlide: true
          }
        }
      }
    }) 
  ])

  if (!lesson || !course) {
    throw new Error("Lesson not found")
  }

  return (
    <div>
      <LessonViewer 
        lesson={lesson}
        user={user} 
        course={course}
      />
    </div>
  )
}