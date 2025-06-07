import { Button } from "@/components/ui/button"
import { ChevronRight, Plus } from "lucide-react"
import Link from "next/link"

export default function ScrollableFeatures() {
  return (
    <div className="min-h-screen ">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Meeting Scheduler */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/original-1c6785b9c6f8d99e9acfc4b9159d611b-xrM5mY7Mb7GUjUAslKXmXzkFGUQROu.webp"
                  alt="Host"
                  width={64}
                  height={64}
                  className="rounded-full"
                />
                <Link href="/i/meeting/schedule" className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                 
                    <Plus className="h-4 w-4" />
                
                </Link>
              </div>
              <span className="text-sm text-gray-600">Its time to schedule your next smart meeting!</span>
            </div>

            {/* Hero Text */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7x font-light leading-tight">
              Intelligent Video Meetings
              <br />
              with AI-Powered Collaboration.
            </h1>

            {/* Statistics Card */}
            <div className="bg-[#e8f3f3] rounded-3xl p-6 w-fit">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm">User Satisfaction</span>
                <div className="h-5 w-5 rounded-full bg-white flex items-center justify-center text-xs">i</div>
              </div>
              <div className="text-4xl font-medium mb-2">94%</div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Positive feedback</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>

            {/* Smart Meeting Features */}
            <div className="relative overflow-hidden rounded-3xl bg-[#e8f3f3] p-6">
              <div className="relative z-10">
                <div className="text-sm mb-4">Highlights</div>
                <h3 className="text-xl mb-2">Auto Transcription & Summaries</h3>
                <ChevronRight className="h-5 w-5" />
              </div>
              <img
                src="/placeholder.svg"
                alt="Waves"
                width={300}
                height={100}
                className="absolute bottom-0 left-0 w-full opacity-50"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-gray-600 mb-1">
                  Making real-time communication accessible, inclusive, and productive 
                  <br />
                  to all humanity.
                </div>
              </div>
             
            </div>

            {/* Video Chat Preview */}
            <div className="relative">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/original-1c6785b9c6f8d99e9acfc4b9159d611b-xrM5mY7Mb7GUjUAslKXmXzkFGUQROu.webp"
                alt="Video Chat"
                width={500}
                height={400}
                className="rounded-3xl"
              />
              <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3">
                <div className="flex items-center gap-4">
                  <span>Real-time Meetings</span>
                  <div className="flex items-center gap-2">
                    <div className="bg-black text-white text-xs rounded-full px-3 py-1">Quality Video</div>
                    <div className="bg-black text-white text-xs rounded-full px-2 py-1">+</div>
                    <div className="bg-black text-white text-xs rounded-full px-3 py-1">No Latency</div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Chat and Notes */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium">
                 Tutoring Made Easy
                </h3>
                <Button variant="secondary" size="sm" className="rounded-full">
                  Start Now <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="text-sm text-gray-600">
               Imagine a live streaming platform with an integrated, intuitive slide 
                <br />
                viewer—designed to make education truly futuristic. 🚀
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm mb-1">Game changer</div>
              <h2 className="text-2xl">
                Inclusive Meetings for All
              </h2>
            </div>
            <Button variant="link" className="text-gray-400">
              Read More
            </Button>
          </div>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-between py-6">
              Support for visual impairments
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between py-6">
              Support for hearing impairments
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
