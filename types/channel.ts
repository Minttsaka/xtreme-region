import { Prisma } from "@prisma/client"


export type Channel = Prisma.ChannelGetPayload<{
    select: {
          createdAt: true,
          name: true,
          isFeatured:true,
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
}>

export type Slide = Prisma.SlideGetPayload<{
  include: {
    notes: true,
  }
}>

export type SingleCourse = Prisma.UserCourseGetPayload<{
   include:{
    rating:true,
    completeArena:true,
    likes:true,
    review:{
      include:{
        user:true,
        reviewLike:true
      }
    },
    enrollment:true,
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
}>


export type singleChannel = Prisma.ChannelGetPayload<{
  include:{
    likes:true,
    views:true,
    subscriptions:true,
    rating:true,
      courses:{
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
}>

export type Lesson = Prisma.LessonGetPayload<{ 
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
   }>

 export type CourseUser = Prisma.UserGetPayload<{
   include:{
      completeArena:{
        select:{
          id:true,
        }
      }
    }
 }> 
 
  export type StudyLesson = Prisma.LessonGetPayload<{
       include: {
        finalSlide: {
          include: {
            notes: true,
            completeArena: {
              where: {
                type: "SLIDE",
              
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
 }> 


 export type Review = Prisma.ReviewGetPayload<{
  include:{
    user:true,
    reviewLike:true
  }
}>
