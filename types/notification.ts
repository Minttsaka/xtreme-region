import { AccessLevel } from "@prisma/client"

export interface Institution {
    id: string
    name: string
    type: 'registered' | 'connected'
    status: 'active' | 'pending' | 'inactive'
    dateAdded: string
    logo?: string
    connectionType?: 'API' | 'SFTP' | 'Direct'
    lastSync?: string
    totalTransactions?: number
    location?: string
    category?: 'bank' | 'credit_union' | 'fintech' | 'other'
  }

  export type CreateNotificationData = {
    title: string
    content: string
    priority: "LOW" | "NORMAL" | "HIGH" | "URGENT"
    isPinned: boolean
    category: "GENERAL" | "ASSIGNMENT" | "EXAM" | "SCHEDULE" | "RESOURCE"
    targetedAudience: AccessLevel
    courseId: string
  }
  
  