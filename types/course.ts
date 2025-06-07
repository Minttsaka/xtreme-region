import { Prisma } from "@prisma/client"

export type CourseStatus = 'draft' | 'scheduled' | 'live' | 'completed' | 'archived'
export type AccessLevel = 'PUBLIC' | 'REGISTERED_USERS' | 'ENROLLED_ONLY'
export type InteractionType = 'reaction' | 'question' | 'answer' | 'note'

export type SessionPayload = {
  userId     :  string
  expiresAt   :   Date
}

export type SelectedResource = Prisma.ResourceGetPayload<{
    include:{
      authors:true,
    }
}>

export type NewLesson = {
  price: number | null | undefined;
  resources: Set<SelectedResource>;
  status: "COMPLETED"| "IN_PROGRESS"| "NOT_STARTED";
  description: string;
  title: string;
  isPaid: boolean;
  accessLevel: "PUBLIC" | "REGISTERED_USERS" | "ENROLLED_ONLY";
  allowComments: boolean;
  downloadableResources: boolean;
  duration?: number | null;
}


export interface CourseResource {
  id: string
  type: 'document' | 'video' | 'image' | 'audio' | 'presentation'
  name: string
  url: string
  thumbnail?: string
  duration?: number
  size?: number
}

export interface CourseInteraction {
  id: string
  type: InteractionType
  content: string
  userId: string
  userName: string
  userAvatar: string
  timestamp: string
  reactions?: {
    type: string
    count: number
  }[]
}

export interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  instructor: {
    id: string
    name: string
    avatar: string
    title: string
  }
  status: CourseStatus
  accessLevel: AccessLevel
  startDate?: string
  duration: number
  resources: CourseResource[]
  interactions: CourseInteraction[]
  participants: number
  rating: number
  settings: {
    enableChat: boolean
    enableQA: boolean
    enablePolls: boolean
    enableRecording: boolean
    requireRegistration: boolean
    allowReplay: boolean
  }
}

export type CourseList = Prisma.UserCourseGetPayload<{
  include: {
    review:{
      include:{
        user:true,
        reviewLike:true
      }
    },
    notification:true,
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
}>


export type CollaboratedCourse = Prisma.CollaboratorsGetPayload<{
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
}>

export interface Note {
  id: string;
  content: string;
  type: 'text' | 'image' | 'video';
  source?: string;
}

export interface Slide {
  id: string;
  title:string;
  notes: Note[];
  comments: Comment[];
}

export interface SlideTheme {
  primary: string
  secondary: string
  background: string
  text: string
}


export type MessageInput = {
  text: string;
  slide:string
  sender: string;
  reactions:Reaction[]
  type:string,
  isCurrentUser: boolean;
};

export type User = Prisma.UserGetPayload<{}>


export type Sender = {
  id: string
  name: string
  email: string
  image: string
}

export type Comment = {
  id: string
  text: string
  sender: Sender
  type?: string
  slide?: string
  createdAt: Date
  updatedAt: Date
  reactions: Reaction[]
}
export type Reaction = {
  id:string
  emoji: string
  user: string
}




