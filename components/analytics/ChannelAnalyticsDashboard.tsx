"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getChannelAnalytics } from "@/app/actions/analytics"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Users, Eye, ThumbsUp, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import type { ChannelAnalytics, ChartDataItem, ViewsChartData, EngagementRateData } from "@/types/analytics"

interface ChannelAnalyticsProps {
  channelId: string
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

const ChannelAnalyticsDashboard = ({ channelId }: ChannelAnalyticsProps) => {
  const [analytics, setAnalytics] = useState<ChannelAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true)
        const result = await getChannelAnalytics(channelId)

        if (result.success && result.analytics) {
          setAnalytics(result.analytics)
        } else {
          toast.error(result.error || "Failed to load analytics")
        }
      } catch (error) {
        console.error("Error fetching analytics:", error)
        toast.error("Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [channelId])

  // Format subscribers by tier for chart
  const subscribersByTierData: ChartDataItem[] =
    analytics?.subscribersByTier?.map((item) => ({
      name: item.tier,
      value: item._count,
    })) || []

  // Format views over time for chart
  const viewsOverTimeData: ViewsChartData[] =
    analytics?.viewsOverTime?.map((item) => {
      const date = new Date(item.createdAt)
      return {
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        views: item._count,
      }
    }) || []

  // Calculate engagement rates
  const engagementRateData: EngagementRateData[] = [
    {
      name: "Like Rate",
      value: analytics?.totalViews ? (analytics.totalLikes / analytics.totalViews) * 100 : 0,
    },
    {
      name: "Comment Rate",
      value: analytics?.totalViews ? (analytics.totalComments / analytics.totalViews) * 100 : 0,
    },
  ]

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="h-80 bg-gray-200 rounded animate-pulse mt-6"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Channel Analytics</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Views</p>
                <h3 className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</h3>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Likes</p>
                <h3 className="text-2xl font-bold">{analytics.totalLikes.toLocaleString()}</h3>
              </div>
              <div className="p-2 bg-green-100 rounded-full">
                <ThumbsUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Comments</p>
                <h3 className="text-2xl font-bold">{analytics.totalComments.toLocaleString()}</h3>
              </div>
              <div className="p-2 bg-orange-100 rounded-full">
                <MessageSquare className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Subscribers</p>
                <h3 className="text-2xl font-bold">{analytics.totalSubscribers.toLocaleString()}</h3>
              </div>
              <div className="p-2 bg-purple-100 rounded-full">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="engagement">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Views Over Time</CardTitle>
              <CardDescription>Daily view count for the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={viewsOverTimeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="views" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>Key engagement statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-2 text-gray-500" />
                      <span>Total Views</span>
                    </div>
                    <span className="font-medium">{analytics.totalViews.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <ThumbsUp className="w-4 h-4 mr-2 text-gray-500" />
                      <span>Total Likes</span>
                    </div>
                    <span className="font-medium">{analytics.totalLikes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2 text-gray-500" />
                      <span>Total Comments</span>
                    </div>
                    <span className="font-medium">{analytics.totalComments.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Rate</CardTitle>
                <CardDescription>Likes and comments relative to views</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={engagementRateData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: "Percentage (%)", angle: -90, position: "insideLeft" }} />
                      <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`, "Rate"]} />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subscribers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscribers by Tier</CardTitle>
              <CardDescription>Distribution of subscribers across tiers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={subscribersByTierData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {subscribersByTierData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value} subscribers`, "Count"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscriber Details</CardTitle>
              <CardDescription>Detailed subscriber information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-gray-500" />
                    <span>Total Subscribers</span>
                  </div>
                  <span className="font-medium">{analytics.totalSubscribers.toLocaleString()}</span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Subscribers by Tier</h4>
                  {subscribersByTierData.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ChannelAnalyticsDashboard
