"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-lg mx-auto text-center space-y-6">
        {/* Error Icon */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center animate-pulse">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
          <div className="absolute -top-2 -right-2 animate-bounce">
            <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
              <Bug className="w-5 h-5 text-orange-800" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <Card className="border-2 border-red-200 bg-red-50/50">
          <CardHeader>
            <CardTitle className="text-2xl text-red-800">Oops! Something Went Wrong</CardTitle>
            <CardDescription className="text-red-600">
              Our developers are working extra hard to fix this issue!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white/50 rounded-lg p-4 border border-red-200">
              <p className="text-sm text-gray-700">
                <strong>What happened?</strong>
                <br />A technical hiccup occurred while our AI was processing your request. Don't worry - our
                development team is already on it! 🛠️
              </p>
            </div>

            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">Our developers are debugging with extra coffee ☕</p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={reset} className="bg-red-600 hover:bg-red-700">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>

                <Link href="/">
                  <Button variant="outline" className="border-2">
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>If this keeps happening, our support team is here to help! 🚀</p>
        </div>
      </div>
    </div>
  )
}
