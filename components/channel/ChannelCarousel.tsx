"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Prisma } from "@prisma/client"



type Channel = Prisma.ChannelGetPayload<{
  include:{
      user:true
    }
}>

export default function ChannelCarousel({
  channels
}:{
  channels: Channel[]
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoplay, setIsAutoplay] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  const nextSlide = useCallback(() => {
    setActiveIndex((current) => (current === channels.length - 1 ? 0 : current + 1))
  }, [])

  const prevSlide = useCallback(() => {
    setActiveIndex((current) => (current === 0 ? channels.length - 1 : current - 1))
  }, [])

  useEffect(() => {
    if (isAutoplay && !isPaused) {
      const interval = setInterval(() => {
        nextSlide()
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isAutoplay, isPaused, nextSlide])

  return (
    <div className="relative w-full container pt-10 mx-auto overflow-hidden rounded-xl">
      {/* Banner container */}
      <div
        className="relative h-24 sm:h-32 w-full overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Carousel items */}
        <div className="h-full w-full relative">
          {channels.map((channel, index) => (
            <div
              key={channel.id}
              className={cn(
                "absolute inset-0 flex items-center justify-between px-4 sm:px-8 transition-all duration-500 ease-in-out",
                {
                  "opacity-100 translate-x-0": index === activeIndex,
                  "opacity-0 translate-x-full": index > activeIndex,
                  "opacity-0 -translate-x-full": index < activeIndex,
                },
              )}
            >
              <div className="flex items-center space-x-3">
                {/* Owner image */}
                <div className="relative">
                  <img
                    src={channel.user.image || "https://www.kapwing.com/resources/content/images/size/w1200/2021/02/Screen-Shot-2021-02-02-at-2.17.11-PM.png"}
                    alt={`${channel.name} owner`}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                </div>

                <div className="flex flex-col">
                  <h3 className={cn("font-bold text-sm sm:text-base")}>{channel.name}</h3>
                  <p className={cn("text-xs opacity-80 max-w-xs")}>{channel.description}</p>
                  <div className="mt-1">
                    <span
                      className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full shadow-sm",
                        
                      )}
                    >
                      Featured Channel
                    </span>
                  </div>
                </div>
              </div>

              {/* Channel thumbnail */}
              <div className="relative">
                <img
                  src={channel.thumbnail || "https://www.kapwing.com/resources/content/images/size/w1200/2021/02/Screen-Shot-2021-02-02-at-2.17.11-PM.png"}
                  alt={`${channel.name} thumbnail`}
                  className="h-16 w-24 sm:h-20 sm:w-32 rounded-lg object-cover shadow-lg"
                />
                <div
                  className={cn(
                    "absolute -bottom-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center shadow-md",
                   
                  )}
                >
                  <span className={cn("text-[8px] font-medium")}>Live</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={(e) => {
            e.preventDefault()
            prevSlide()
            setIsAutoplay(false)
            setTimeout(() => setIsAutoplay(true), 10000)
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center shadow-lg z-10 hover:bg-white transition-colors"
          aria-label="Previous channel"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault()
            nextSlide()
            setIsAutoplay(false)
            setTimeout(() => setIsAutoplay(true), 10000)
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center shadow-lg z-10 hover:bg-white transition-colors"
          aria-label="Next channel"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Indicator dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5">
          {channels.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveIndex(index)
                setIsAutoplay(false)
                setTimeout(() => setIsAutoplay(true), 10000)
              }}
              className={cn("w-1.5 h-1.5 rounded-full transition-all", {
                "bg-gray-800 w-3": index === activeIndex,
                "bg-gray-400": index !== activeIndex,
              })}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
