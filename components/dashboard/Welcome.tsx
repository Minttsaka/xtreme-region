
"use client"
import Link from "next/link"
import { CustomButton } from "../ui/CustomButton"
import {  User } from "@prisma/client"

export default function WelcomeNewSignup({ user }:{ user:User }) {


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
      <div className="font-normal flex space-x-2 items-center text-sm mr-4 text-gray-800 px-2 py-1" >
        <span className="font-medium bg-gradient-to-r from-primary to-green-500 text-transparent bg-clip-text">
          XTREME-REGION
        </span>
      </div>
      </header>

      {/* Welcome message */}
      <div className="container md:rounded-full  bg-blue-900 relative mx-auto px-4 pt-8 pb-4">
        <div className=" p-6  text-white">
          <h2 className="text-2xl md:text-6xl lg:text-7x font-light leading-tight">Welcome! {user.name}</h2>
          <p className=" mt-1">Explore features below.</p>
        </div>
        <div className="absolute bottom-0 overflow-hidden right-0 w-full h-full opacity-20">
              {/* Hexagon pattern simulation */}
              <div className="absolute inset-0">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-16 h-16 border border-blue-400 rotate-45"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      opacity: Math.random() * 0.5 + 0.1,
                    }}
                  />
                ))}
              </div>
            </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1 - AI Safety */}
          <div className="bg-gray-100 p-12 rounded-3xl relative overflow-hidden">
            <div className="max-w-md space-y-4 relative z-10">
              <h2 className="text-2xl md:text-6xl lg:text-7x font-light leading-tight">Meetings and Collaborations</h2>
              <p className="text-gray-600">
                Connect your team and students from anywhere with crystal-clear video and audio.
              </p>
              <div className="pt-8">
                <Link href="/i/meeting">
                <CustomButton className="bg-black">
                  EXPLORE MORE
                  </CustomButton>
                </Link>
              </div>
            </div>
            <div className="absolute bottom-0 overflow-hidden right-0 w-3/4 h-3/4 opacity-50">
              <div className="w-full h-full rounded-full border border-gray-300 relative">
                {/* Dots pattern simulation */}
                <div className="absolute inset-0 opacity-30">
                  {Array.from({ length: 200 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-gray-500 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        opacity: Math.random() * 0.8 + 0.2,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 - Breakthrough Research */}
          <div className="bg-black text-white p-12 rounded-3xl relative overflow-hidden">
            <div className="max-w-md space-y-4 relative z-10">
              <h2 className="text-2xl md:text-6xl lg:text-7x font-light leading-tight">CONDUCT SURVEY</h2>
              <p className="text-gray-400">
               Gather valuable insights with AI-Powered surveys and advanced analysis.
              </p>
              <div className="pt-8">
                <Link href="/i/survey">
                <CustomButton className="bg-white  text-black">
                  Take a Tour
                  </CustomButton>
                </Link>
              </div>
            </div>
            <div className="absolute bottom-0 overflow-hidden right-0 w-full h-full opacity-20">
              {/* Circular pattern simulation */}
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full border border-gray-600"
                  style={{
                    width: `${(i + 1) * 25}%`,
                    height: `${(i + 1) * 25}%`,
                    bottom: "10%",
                    right: "10%",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Card 3 - Channel Management */}
          <div className="bg-purple-50 p-12 rounded-3xl relative overflow-hidden">
            <div className="max-w-md space-y-4 relative z-10">
              <h2 className="text-2xl md:text-6xl lg:text-7x font-light leading-tight">Channel Management</h2>
              <p className="text-gray-600">
                Manage all your lesson channels in one place with advanced analytics and distribution tools.
              </p>
              <div className="pt-8">
                <Link
                  href="/i/channel"
                >
                  <CustomButton className="bg-purple-900">
                    MANAGE CHANNELS
                  </CustomButton>
                </Link>
              </div>
            </div>
            <div className="absolute bottom-0 overflow-hidden right-0 w-3/4 h-3/4 opacity-30">
              {/* Grid pattern simulation */}
              <div className="w-full h-full relative">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-full border-b border-purple-300"
                    style={{ top: `${i * 10}%`, opacity: 0.3 + i * 0.05 }}
                  />
                ))}
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute h-full border-r border-purple-300"
                    style={{ left: `${i * 10}%`, opacity: 0.3 + i * 0.05 }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Card 4 - Institution */}
          <div className="bg-blue-900 text-white p-12 rounded-3xl relative overflow-hidden">
            <div className="max-w-md space-y-4 relative z-10">
              <h2 className="text-2xl md:text-6xl lg:text-7x font-light leading-tight">Institution Access</h2>
              <p className="text-blue-200">
                Register school and empower your institution with our AI-driven tools and resources.
              </p>
              <div className="pt-8">
                <Link
                  href="/i/institution"
                >
                  <CustomButton className="bg-green-500">
                  INSTITUTION PORTAL
                  </CustomButton>
                </Link>
              </div>
            </div>
            <div className="absolute bottom-0 overflow-hidden right-0 w-full h-full opacity-20">
              {/* Hexagon pattern simulation */}
              <div className="absolute inset-0">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-16 h-16 border border-blue-400 rotate-45"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      opacity: Math.random() * 0.5 + 0.1,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-6 text-right text-xs text-gray-400">
        Powered by Mint AI assistant.
      </footer>
    </div>
  )
}
