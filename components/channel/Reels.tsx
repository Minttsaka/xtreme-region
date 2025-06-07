'use client'

import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Reel {
  id: number
  thumbnail: string
  title: string
  author: string
}

const reels: Reel[] = [
  { id: 1, thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZW5nbGlzaCUyMGNsYXNzfGVufDB8fDB8fHww', title: 'Quick English Tip', author: 'Language Master' },
  { id: 2, thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWF0aCUyMGNsYXNzfGVufDB8fDB8fHww', title: 'Math Trick', author: 'Number Ninja' },
  { id: 3, thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmlvbG9neSUyMGNsYXNzfGVufDB8fDB8fHww', title: 'Biology Fun Fact', author: 'Science Guru' },
  { id: 4, thumbnail: 'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGlzdG9yeSUyMGNsYXNzfGVufDB8fDB8fHww', title: 'History in 60 Seconds', author: 'Time Traveler' },
  { id: 5, thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGh5c2ljcyUyMGNsYXNzfGVufDB8fDB8fHww', title: 'Physics Experiment', author: 'Science Whiz' },
]

const ReelsComponent: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef
      const scrollAmount = direction === 'left' ? -current.offsetWidth : current.offsetWidth
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <div className="relative container mx-auto px-4">
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
        onClick={() => scroll('left')}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
        onClick={() => scroll('right')}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-4 pb-4 hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reels.map((reel) => (
          <motion.div
            key={reel.id}
            className="flex-shrink-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="w-96">
              <CardContent className="p-0">
                <div className="relative h-64 w-full">
                  <img
                    src={reel.thumbnail}
                    alt={reel.title}
                
                    className="rounded-t-lg object-cover w-full h-full"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                    <h3 className="text-white text-sm font-semibold">{reel.title}</h3>
                    <p className="text-gray-300 text-xs">{reel.author}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ReelsComponent

