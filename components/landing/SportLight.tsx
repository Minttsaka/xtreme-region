"use client"

import TrustedBy1 from "./TrustedBy1"
import AnimatedButtons from "./AnimatedButtons"
import { Badge } from "../ui/badge"
import { Award, Video, Cpu, Brain, Zap, BarChart, Sparkles, Building, Presentation, Speaker, TestTube, DollarSign } from "lucide-react"
import SponsorLogos from "./SponsorLogos"
import NavBar from "./nav/NavBar"

export function SpotlightReview() {

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-b from-slate-50 to-blue-50">
      {/* Navbar */}
      <NavBar />

      {/* Futuristic Background Elements - Light Theme */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#ffffff_0%,#f0f7ff_70%)] opacity-70"></div>
      <div className="absolute inset-0 bg-grid-black/[0.03] bg-[size:50px_50px]"></div>

      {/* Animated particles - Light Theme */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-500/10 blur-xl"
            style={{
              width: `${Math.random() * 300 + 50}px`,
              height: `${Math.random() * 300 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              opacity: Math.random() * 0.3,
            }}
          />
        ))}
      </div>

      {/* Cyber lines - Light Theme */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-full h-full border-[1px] border-blue-500/10 rounded-full animate-pulse"
          style={{ width: "200%", height: "200%", top: "-50%", left: "-50%" }}
        ></div>
        <div
          className="absolute w-full h-full border-[1px] border-cyan-500/10 rounded-full animate-pulse"
          style={{ width: "180%", height: "180%", top: "-40%", left: "-40%", animationDelay: "1s" }}
        ></div>
        <div
          className="absolute w-full h-full border-[1px] border-purple-500/10 rounded-full animate-pulse"
          style={{ width: "160%", height: "160%", top: "-30%", left: "-30%", animationDelay: "2s" }}
        ></div>
      </div>

      {/* Floating tech specs - Light Theme */}
      <div className="absolute top-20 right-10 hidden lg:block">
        <div className="bg-white/80 backdrop-blur-md p-3 rounded-lg border border-blue-500/30 animate-float text-xs text-blue-700 max-w-[200px] shadow-lg shadow-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Speaker className="h-4 w-4" />
            <span className="font-bold">LESSON CHANNELS</span>
          </div>
          <p>Create and subscribe to channels or lessons and discussions</p>
        </div>
      </div>

      <div className="absolute bottom-40 left-10 hidden lg:block">
        <div
          className="bg-white/80 backdrop-blur-md p-3 rounded-lg border border-green-500/30 animate-float text-xs text-green-700 max-w-[200px] shadow-lg shadow-green-100"
          style={{ animationDelay: "1s" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-4 w-4" />
            <span className="font-bold">AI CAPABILITIES</span>
          </div>
          <p>Advanced machine learning algorithms for real-time translation and transcription.</p>
        </div>
      </div>

      <div className="absolute top-40 left-20 hidden lg:block">
        <div
          className="bg-white/80 backdrop-blur-md p-3 rounded-lg border border-purple-500/30 animate-float text-xs text-purple-700 max-w-[200px] shadow-lg shadow-purple-100"
          style={{ animationDelay: "2s" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4" />
            <span className="font-bold">REVENUE GENERATION</span>
          </div>
          <p>Instructors can earn revenue through channel subscriptions, offering exclusive content and engaging with their audience.</p>
        </div>
      </div>

      {/* Main content */}
      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-32 md:pt-24">
        <section className="min-h-screen flex items-center justify-center">
          <div className="container mx-auto text-center">
            {/* Top badges */}
            <div className="flex justify-center gap-2 flex-wrap mb-4">
              <Badge
                variant="secondary"
                className="animate-float text-blue-700 bg-white/70 backdrop-blur-sm space-x-1 border-blue-200 shadow-sm"
              >
                <Award className="h-3 w-3 text-yellow-500" />
                <span className="text-xs uppercase font-light antialiased">Innovative Technology</span>
              </Badge>

              <Badge
                variant="secondary"
                className="animate-float text-green-700 bg-white/70 backdrop-blur-sm space-x-1 border-green-200 shadow-sm"
                style={{ animationDelay: "0.5s" }}
              >
                <Video className="h-3 w-3 text-green-500" />
                <span className="text-xs uppercase font-light antialiased">High Quality Video Chat</span>
              </Badge>

              <Badge
                variant="secondary"
                className="animate-float text-purple-700 bg-white/70 backdrop-blur-sm space-x-1 border-purple-200 shadow-sm"
                style={{ animationDelay: "1s" }}
              >
                <Zap className="h-3 w-3 text-purple-500" />
                <span className="text-xs uppercase font-light antialiased">Secure and Reliable.</span>
              </Badge>
            </div>

            {/* Version tag */}
            <div className="mb-4">
              <span className="px-2 py-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-xs font-mono text-white">
                BETA VERSION
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7x font-light leading-tight">
              <span className="bg-clip-text text-gray-900">
                Next-Gen{" "}
                <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 text-white">AI-Powered</span>
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600">
                Communication Solution.
              </span>
            </h1>

            <div className="relative mb-8">
              <p className="text-sm md:text-lg mb-4 max-w-3xl mx-auto animate-fade-in-up text-gray-700 leading-relaxed">
                <span className="font-medium bg-gradient-to-r from-primary to-green-500 text-transparent bg-clip-text">
                  XTREME-REGION
                </span> is empowering institutions, schools and individual with advanced communication 
                tools using ai to reach their full potential.
              </p>
            </div>

            {/* Feature highlights - Futuristic Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">

              {/* Feature Card 2 */}
              <div className="group relative">
                {/* Animated border effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-30 blur-sm group-hover:opacity-100 transition duration-300 group-hover:duration-200 animate-tilt"></div>

                {/* Card content */}
                <div className="relative flex flex-col h-full bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-md"></div>
                  <div className="absolute right-0 bottom-0 w-32 h-32 bg-pink-500/10 rounded-full blur-md"></div>

                  {/* Tech pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="circuit" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path
                            d="M 0 10 L 10 10 L 10 0 M 20 10 L 10 10 M 10 20 L 10 10"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.5"
                          />
                        </pattern>
                      </defs>
                      <rect width="100" height="100" fill="url(#circuit)" />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      <Presentation className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900">Video Conferencing</h3>
                  </div>

                  <p className="text-gray-700 relative z-10 mb-4">
                    Connect with your team and students from anywhere in real-time with crystal-clear video and audio.
                  </p>

                  {/* Tech specs */}
                  <div className="mt-auto pt-4 border-t border-purple-100 flex justify-between items-center text-xs text-gray-500 relative z-10">
                    <span>Video</span>
                    <span>|</span>
                    <span>Audio</span>
                    <span>|</span>
                    <span>Transcription</span>
                  </div>
                </div>
              </div>

              {/* Feature Card 3 */}
              <div className="group relative">
                {/* Animated border effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-2xl opacity-30 blur-sm group-hover:opacity-100 transition duration-300 group-hover:duration-200 animate-tilt"></div>

                {/* Card content */}
                <div className="relative flex flex-col h-full bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-md"></div>
                  <div className="absolute right-0 bottom-0 w-32 h-32 bg-teal-500/10 rounded-full blur-md"></div>

                  {/* Tech pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="hexagons" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path
                            d="M10,1.73 L1.73,10 L10,18.27 L18.27,10 Z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.5"
                          />
                        </pattern>
                      </defs>
                      <rect width="100" height="100" fill="url(#hexagons)" />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 text-white">
                      <Building className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900">School Management</h3>
                  </div>

                  <p className="text-gray-700 relative z-10 mb-4">
                    Register and manage your school more efficiently like a pro and reduce cost by 60%. Monetize your tutoring skills with us.
                  </p>

                  {/* Tech specs */}
                  <div className="mt-auto pt-4 border-t border-cyan-100 flex justify-between items-center text-xs text-gray-500 relative z-10">
                    <span>School reports</span>
                    <span>|</span>
                    <span>Finance</span>
                    <span>|</span>
                    <span>AI Statatistics</span>
                  </div>
                </div>
              </div>

               {/* Feature Card 1 */}
              <div className="group relative">
                {/* Animated border effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl opacity-30 blur-sm group-hover:opacity-100 transition duration-300 group-hover:duration-200 animate-tilt"></div>

                {/* Card content */}
                <div className="relative flex flex-col h-full bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-md"></div>
                  <div className="absolute right-0 bottom-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-md"></div>

                  {/* Tech pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="100" height="100" fill="url(#grid)" />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                      <TestTube className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900">Research Center</h3>
                  </div>

                  <p className="text-gray-700 relative z-10 mb-4">
                    Conduct research and get advanced  analysis using ai like never before.
                  </p>

                  {/* Tech specs */}
                  <div className="mt-auto pt-4 border-t border-blue-100 flex justify-between items-center text-xs text-gray-500 relative z-10">
                    <span>AI</span>
                    <span>|</span>
                    <span>Survey</span>
                    <span>|</span>
                    <span>Data analysis</span>
                  </div>
                </div>
              </div>
            </div>

            <AnimatedButtons />

            {/* Tech specs */}
            <div className="flex justify-center gap-4 flex-wrap my-8">
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-3 py-1 rounded-full border border-blue-200 shadow-sm">
                <Cpu className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-gray-700">Intelligent Grades Recording</span>
              </div>
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-3 py-1 rounded-full border border-purple-200 shadow-sm">
                <BarChart className="h-4 w-4 text-purple-600" />
                <span className="text-xs text-gray-700">Data Insights Platform</span>
              </div>
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md px-3 py-1 rounded-full border border-cyan-200 shadow-sm">
                <Sparkles className="h-4 w-4 text-cyan-600" />
                <span className="text-xs text-gray-700">Smart Feature Upgrades</span>
              </div>
            </div>

            <TrustedBy1 />
            <SponsorLogos />
          </div>
        </section>
      </div>

      {/* Floating orbs - Light Theme */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-10 blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 opacity-10 blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* Cyber grid lines - Light Theme */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f05_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f05_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    </div>
  )
}
