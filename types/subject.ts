import { Prisma } from "@prisma/client"

export type Subject = Prisma.SubjectToClassGetPayload<{
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
}>
