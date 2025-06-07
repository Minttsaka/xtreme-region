"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface RevenueChartProps {
  data: Array<{ date: string; revenue: number }>
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <CardDescription>Course revenue over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} background={{ fill: "#f9fafb" }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-between text-sm">
          <div>
            <p className="text-gray-500">Total Revenue</p>
            <p className="font-medium">${data.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500">Average</p>
            <p className="font-medium">
              ${(data.reduce((sum, item) => sum + item.revenue, 0) / data.length).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Highest</p>
            <p className="font-medium">${Math.max(...data.map((item) => item.revenue)).toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
