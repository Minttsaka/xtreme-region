import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export default function VideoAd() {
  return (
      <div className="mb-10">
         <div className=" gap-5 max-w-4xl mx-auto z-50 text-gray-400 text-center  px-5 md:px-0">
            <div className="flex mt-5 justify-center">
              <div className="mb-5 lg:mb-5 overflow-hidden tracking-[3px] text-xs md:px-5 md:py-2 lg:text-xs uppercase bg-white bg-opacity-5 text-[#D1AAD7] rounded-full w-fit px-4 py-2"><span>AI for Communication</span></div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7x font-light leading-tight">Driving <span className="text-green-400">Innovation</span> in Communication</h1>
            <p className="mb-10">
            In a rapidly evolving communication landscape, our system is designed to empower 
            organizations and individuals with innovative tools to streamline interactions and enhance <span className="text-purple-400">engagement and clarity</span>. 
            By leveraging advanced AI—such as real-time transcription and intelligent live chat—we enable seamless communication,
             support dynamic learning environments, and help users overcome the challenges of modern information exchange.
              </p>
        </div>
      
      <div className="container relative mx-auto">
        
      {/* <div className="absolute rounded-2xl inset-0 bg-gradient-to-tr from-violet-950/20 via-gray-900 to-fuchsia-950/20" />
      <div className="absolute rounded-2xl inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" /> */}
        {/* Main Video Container */}
        <div className="group relative overflow-hidden rounded-2xl  ">

          {/* Video Player */}
          <div className="group relative aspect-video">
            <video 
              src="/video/edu.mp4"
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>

          {/* Video Info */}
          <div className="relative z-10 grid gap-6  md:grid-cols-3">
            {/* Course Info */}
            <Card className="col-span-2 rounded-t-none border-white/10 bg-white/5 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold text-white">Transcription and meeting summarization</h3>
                <p className="mt-2 text-gray-400 text-xs">
                  Explore the power of AI-driven text transcription and its practical applications in streamlining communication.
                  This feature-rich solution captures spoken content in real time and uses intelligent summarization to
                  deliver clear, concise meeting overviews—helping teams stay aligned and informed with minimal effort.

                </p>
                <div className="mt-4 flex flex-wrap gap-1">
                  {[
                    "Real-Time Transcription",
                    "Intelligent Summarization",
                    "Natural Language Processing",
                    "Conversational AI",
                    "Accessibility Through Technology"
                  ]
                  .map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="rounded-full text-white bg-white/5 backdrop-blur-sm"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* Floating Orbs */}
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
          <div className="h-[500px] w-[500px] animate-pulse-slow rounded-full bg-violet-500/5 blur-3xl" />
          <div className="h-[400px] w-[400px] animate-pulse-slow rounded-full bg-fuchsia-500/5 blur-3xl" />
        </div>
      </div>
    </div>
  )
}

