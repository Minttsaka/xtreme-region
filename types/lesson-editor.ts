import { Prisma } from '@prisma/client';
import { HighlightArea } from '@react-pdf-viewer/highlight';

export interface Highlight {
  id: number;
  content: string;
  highlightAreas: HighlightArea[];
  quote: string;
  color:string
}

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

