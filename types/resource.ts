export type ResourceType = 'book' | 'article' | 'paper' | 'document' | 'worksheet'
export type ResourceFormat = 'pdf' | 'epub' | 'mobi' | 'doc' | 'docx'
export type ResourceCategory = 'textbook' | 'workbook' | 'guide' | 'reference' | 'literature'

export interface ResourceAuthor {
  id: string
  name: string
  avatar?: string
  credentials?: string
}

export interface ResourceTag {
  id: string
  name: string
  color: string
}

export interface ClassSetting {
  enableChat: boolean
  enableQA: boolean
  enablePolls: boolean
  enableScreenShare: boolean
  enableRecording: boolean
  enableBreakoutRooms: boolean
  waitingRoom: boolean
  muteOnEntry: boolean
}



export interface Resource {
  id: string
  title: string
  type: ResourceType
  format: ResourceFormat
  category: ResourceCategory
  cover: string
  authors: ResourceAuthor[]
  description: string
  tags: ResourceTag[]
  rating: number
  reviews: number
  size: number
  pages: number
  lastUpdated: string
  language: string
  isbn?: string
  publisher?: string
  downloadCount: number
  isNew: boolean
  isFeatured: boolean
  preview?: string
}

