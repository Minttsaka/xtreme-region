'use client'


import { useEffect, useRef } from "react"

export default function GridBackground({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      drawBackground()
    }

    // Draw irregular background
    const drawBackground = () => {
      if (!ctx) return
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Grid settings
      const majorGridSize = 100
      const minorGridSize = 25
      
      // Draw distorted grid
      ctx.strokeStyle = 'rgba(75, 75, 75, 0.7)'
      ctx.lineWidth = 0.5

      for (let x = 0; x < canvas.width; x += minorGridSize) {
        ctx.beginPath()
        ctx.moveTo(x + Math.sin(x * 0.01) * 5, 0)
        ctx.lineTo(x + Math.sin(x * 0.01) * 5, canvas.height)
        ctx.stroke()
      }
      
      for (let y = 0; y < canvas.height; y += minorGridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y + Math.cos(y * 0.01) * 5)
        ctx.lineTo(canvas.width, y + Math.cos(y * 0.01) * 5)
        ctx.stroke()
      }

      // Draw major distorted lines
      ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)'
      ctx.lineWidth = 1

      for (let x = 0; x < canvas.width; x += majorGridSize) {
        ctx.beginPath()
        ctx.moveTo(x + Math.sin(x * 0.02) * 10, 0)
        ctx.lineTo(x + Math.sin(x * 0.02) * 10, canvas.height)
        ctx.stroke()
      }
      
      for (let y = 0; y < canvas.height; y += majorGridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y + Math.cos(y * 0.02) * 10)
        ctx.lineTo(canvas.width, y + Math.cos(y * 0.02) * 10)
        ctx.stroke()
      }

      // Draw irregular shapes
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = `rgba(50, 50, 50, ${0.1 - i * 0.02})`
        ctx.beginPath()
        ctx.moveTo(
          canvas.width * (0.2 + i * 0.1), 
          canvas.height * (0.3 + Math.sin(i) * 0.1)
        )
        ctx.bezierCurveTo(
          canvas.width * (0.4 + i * 0.1), canvas.height * 0.2,
          canvas.width * (0.6 + i * 0.1), canvas.height * 0.8,
          canvas.width * (0.8 + i * 0.1), canvas.height * (0.5 + Math.cos(i) * 0.1)
        )
        ctx.lineTo(canvas.width, canvas.height)
        ctx.lineTo(0, canvas.height)
        ctx.closePath()
        ctx.fill()
      }
    }

    // Initial setup
    resizeCanvas()

    // Animation loop
    let animationFrameId: number
    const animate = () => {
      drawBackground()
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()

    // Handle window resize
    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-700 via-zinc-900 to-neutral-700" />
      
      {/* Animated Grid Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-30"
      />
      
      {/* Irregular Shape Overlay */}
      <div 
        className="absolute top-0 right-0 w-1/2 h-screen bg-zinc-900/50"
        style={{
          clipPath: 'polygon(100% 0, 0% 0, 100% 100%)',
          transform: 'skew(-15deg) translateX(10%)',
        }}
      />
       <div className="container mx-auto px-4 relative z-10">         
      </div>
      {children}
    </section>
  )
}

