export interface ChannelAnalytics {
  totalViews: number
  totalLikes: number
  totalComments: number
  totalSubscribers: number
  subscribersByTier: SubscribersByTier[]
  viewsOverTime: ViewsOverTime[]
}

export interface SubscribersByTier {
  tier: string
  _count: number
}

export interface ViewsOverTime {
  createdAt: Date
  _count: number
}

export interface AnalyticsResponse {
  success: boolean
  analytics?: ChannelAnalytics
  error?: string
}

export interface ChartDataItem {
  name: string
  value: number
}

export interface ViewsChartData {
  date: string
  views: number
}

export interface EngagementRateData {
  name: string
  value: number
}
