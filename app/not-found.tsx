"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Home, ArrowLeft, Code, Coffee, Zap, Clock, Wrench, Lightbulb, Rocket } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NotFound() {
  const [dots, setDots] = useState("")
  const [currentTip, setCurrentTip] = useState(0)
  const router = useRouter()

  const developmentTips = [
    "Our developers are debugging with extra coffee ☕",
    "Code compilation in progress... 99.9% complete 🚀",
    "Turning caffeine into code since 2024 💻",
    "Building something amazing for you ⚡",
    "Our AI is learning new tricks 🤖",
    "Crafting the perfect user experience ✨",
  ]

  // Animated dots effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return ""
        return prev + "."
      })
    }, 500)

    return () => clearInterval(interval)
  }, [])

  // Rotate development tips
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % developmentTips.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* 404 Animation */}
        <div className="relative">
          <div className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
            404
          </div>
          <div className="absolute -top-4 -right-4 animate-bounce">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-yellow-800" />
            </div>
          </div>
        </div>

        {/* Main Message */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Oops! Page Under Construction</h1>
          <p className="text-xl text-muted-foreground">This page is still in the workshop, but don't worry!</p>
        </div>

        {/* Development Status Card */}
        <Card className="border-2 border-dashed border-blue-300 bg-blue-50/50">
          <CardHeader>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700 animate-pulse">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Development Active
              </Badge>
            </div>
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              <Code className="w-6 h-6 text-blue-600" />
              Our Developers Are Working Extra Hard{dots}
            </CardTitle>
            <CardDescription className="text-base">
              <div className="transition-all duration-500 ease-in-out">{developmentTips[currentTip]}</div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
                  <Coffee className="w-6 h-6 text-orange-600 animate-bounce" />
                </div>
                <div className="text-sm font-medium">Coffee Consumed</div>
                <div className="text-xs text-muted-foreground">∞ cups</div>
              </div>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                  <Code className="w-6 h-6 text-blue-600 animate-pulse" />
                </div>
                <div className="text-sm font-medium">Lines of Code</div>
                <div className="text-xs text-muted-foreground">1,337+</div>
              </div>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
                  <Zap className="w-6 h-6 text-purple-600 animate-bounce" />
                </div>
                <div className="text-sm font-medium">Energy Level</div>
                <div className="text-xs text-muted-foreground">Maximum</div>
              </div>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-green-600 animate-bounce" />
                </div>
                <div className="text-sm font-medium">Progress</div>
                <div className="text-xs text-muted-foreground">99.9%</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Wrench className="w-4 h-4" />
                  Building amazing features...
                </span>
                <span>99.9%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse"
                  style={{ width: "99.9%" }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Coming */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              What's Coming Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">Enhanced AI Features</div>
                  <div className="text-sm text-muted-foreground">More intelligent conversations</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">Mobile App</div>
                  <div className="text-sm text-muted-foreground">Learn on the go</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">Advanced Analytics</div>
                  <div className="text-sm text-muted-foreground">Track your progress</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">Team Collaboration</div>
                  <div className="text-sm text-muted-foreground">Learn together</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Button>
          </Link>

          <Link href="/pricing">
            <Button size="lg" variant="outline" className="border-2">
              <Zap className="w-5 h-5 mr-2" />
              View Pricing
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p className="mt-2">Questions? Our support team is always ready to help while our devs code away.</p>
        </div>
      </div>
    </div>
  )
}
