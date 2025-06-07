
import { Button } from "@/components/ui/button"
import {ArrowRight } from 'lucide-react'

export default function Footer() {
  return (
    <div className="min-h-screen bg-black rounded-t-3xl">
      {/* Hero Section */}
      <div className="relative min-h-screen">
        {/* Gradient Background */}
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))]" 
          style={{
            background: `radial-gradient(circle at 50% 50%, 
              rgba(76, 29, 149, 0.3) 0%, 
              rgba(59, 130, 246, 0.3) 25%, 
              rgba(0, 0, 0, 1) 100%)`
          }}
        />

        {/* Content */}
        <div className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl text-white lg:text-7x font-light leading-tight">
            Start your journey
          </h1>
          <p className="mt-4 text-3xl font-light text-white/90 sm:text-4xl md:text-5xl">
            with Tiptap
          </p>
          <Button 
            className="mt-8 rounded-full bg-white px-8 text-black hover:bg-white/90"
            size="lg"
          >
            Get started now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

