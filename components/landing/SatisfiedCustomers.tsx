'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    company: "TechCorp Inc.",
    image: "/placeholder.svg?height=100&width=100",
    quote: "This platform revolutionized our online learning experience. Our students are more engaged than ever!",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Chen",
    company: "EduTech Solutions",
    image: "/placeholder.svg?height=100&width=100",
    quote: "The AI-driven personalization has significantly improved our course completion rates. Highly recommended!",
    rating: 5
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    company: "Global Learning Institute",
    image: "/placeholder.svg?height=100&width=100",
    quote: "The seamless integration and scalability have allowed us to reach students worldwide effortlessly.",
    rating: 4
  },
  {
    id: 4,
    name: "David Patel",
    company: "InnoLearn Academy",
    image: "/placeholder.svg?height=100&width=100",
    quote: "Our instructors love the intuitive interface and powerful analytics. It's a game-changer for online education.",
    rating: 5
  }
]

export const SatisfiedCustomers: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  const paginate = (newDirection: number) => {
    setDirection(newDirection)
    setCurrentIndex((prevIndex) => 
      (prevIndex + newDirection + testimonials.length) % testimonials.length
    )
  }

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div 
      className="w-full flex flex-col  justify-center items-center p-8 overflow-hidden"
     
    >
      <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7x font-light leading-tight mb-8">What Our Customers Say</h2>
      <div className="w-full max-w-4xl h-[400px] md:h-[300px] relative flex justify-center items-center">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x)

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1)
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1)
              }
            }}
            className="absolute w-full h-full flex flex-col justify-center items-center bg-neutral-800 bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 shadow cursor-grab active:cursor-grabbing"
          >
            <img src={testimonials[currentIndex].image || "/placeholder.svg"} alt={testimonials[currentIndex].name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" />
            <blockquote className="text-lg md:text-xl text-center my-6 italic leading-relaxed">{testimonials[currentIndex].quote}</blockquote>
            <div className="flex flex-col items-center">
              <strong className="text-lg">{testimonials[currentIndex].name}</strong>
              <span className="text-sm opacity-80">{testimonials[currentIndex].company}</span>
            </div>
            <div className="flex mt-4 gap-1">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex gap-4 mt-8">
        <button 
          onClick={() => paginate(-1)} 
          className="bg-black shadow text-white hover:bg-opacity-30 transition-colors rounded-full w-12 h-12 flex justify-center items-center"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={() => paginate(1)} 
          className="bg-black shadow text-white hover:bg-opacity-30 transition-colors rounded-full w-12 h-12 flex justify-center items-center"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </motion.div>
  )
}

