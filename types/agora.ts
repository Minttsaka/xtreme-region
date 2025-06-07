import { Prisma } from '@prisma/client'
import type { RTMEvents } from 'agora-rtm-sdk'

export type PresenceEvent = RTMEvents.PresenceEvent

export type CurrentUser = Prisma.UserGetPayload<{
  include:{
    channels:{
      include:{
        courses:{
          include:{
            lessons:true,
            course:{
              include:{
                subject:true
              }
            }
          }
        }
      }
    },
    meetings:{
      include:{
        files:true
      }
    }
  }
}>


// Base message interface
export interface User {
  id: string;
  name: string;
  // Add other properties as needed
}

// Base interface
interface BaseAgoraMessage {
  userId: string;
  user: CurrentUser;
  message: string;
}

// Specific message interfaces
export interface AgendaItemsMoveMessage extends BaseAgoraMessage {
  type: "agendaItems_move";
}

export interface DeleteAgendaItemMessage extends BaseAgoraMessage {
  type: "delete_agendaItem";
}

export interface UserJoinMessage extends BaseAgoraMessage {
  type: "user_join";
}

export interface RequestAgendaItemsMessage extends BaseAgoraMessage {
  type: "request_agendaItems";
}

export interface SlideSelectedMessage extends BaseAgoraMessage {
  type: "slide_selected";
}

// Discriminated union
export type AgoraMessage = 
  | AgendaItemsMoveMessage 
  | DeleteAgendaItemMessage 
  | UserJoinMessage 
  | RequestAgendaItemsMessage 
  | SlideSelectedMessage;

// Agora event type
export interface AgoraMessageEvent {
  message: string;
  publisher?: string;
}