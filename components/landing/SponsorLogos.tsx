'use client'

import { useEffect, useRef } from "react"

export default function SponsorLogos() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0')
            entry.target.classList.remove('opacity-0', 'translate-y-4')
          }
        })
      },
      { threshold: 0.1 }
    )

    const logos = containerRef.current?.querySelectorAll('.logo-item')
    logos?.forEach((logo) => observer.observe(logo))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="w-full  mt-10 ">
      <div className="container mx-auto px-4" ref={containerRef}>
        <div className="flex grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-center">
          {/* Using real company logos that might use database solutions */}
          {/* <div className="logo-item opacity-0 translate-y-4 transition-all duration-700 ease-out filter grayscale hover:grayscale-0 hover:scale-110">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2880px-Google_2015_logo.svg.png"
              alt="Company logo"
              width={120}
              height={40}
              className="object-contain h-8 w-auto"
            />
          </div>
          <div className="logo-item opacity-0 translate-y-4 transition-all duration-700 ease-out delay-200 filter grayscale hover:grayscale-0 hover:scale-110">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2880px-Netflix_2015_logo.svg.png"
              alt="Company logo"
              width={120}
              height={40}
              className="object-contain h-8 w-auto"
            />
          </div>
          <div className="logo-item opacity-0 translate-y-4 transition-all duration-700 ease-out delay-300 filter grayscale hover:grayscale-0 hover:scale-110">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Spotify_logo_with_text.svg/2560px-Spotify_logo_with_text.svg.png"
              alt="Company logo"
              width={120}
              height={40}
              className="object-contain h-8 w-auto"
            />
          </div>
          <div className="logo-item opacity-0 translate-y-4 transition-all duration-700 ease-out delay-400 filter grayscale hover:grayscale-0 hover:scale-110">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png"
              alt="Company logo"
              width={120}
              height={40}
              className="object-contain h-8 w-auto"
            />
          </div> */}

          <div className="logo-item opacity-0 translate-y-4 transition-all duration-700 ease-out filter grayscale hover:grayscale-0 hover:scale-110">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg"
              alt="Samsung logo"
              width={120}
              height={40}
              className="object-contain h-8 w-auto"
            />
          </div>

          <div className="logo-item opacity-0 translate-y-4 transition-all duration-700 ease-out filter grayscale hover:grayscale-0 hover:scale-110">
            <img
              src="https://www.must.ac.mw/imgs/logo/must%20log%20black.png"
              alt="Malawi University of Science and Technology logo"
              width={120}
              height={40}
              className="object-contain h-8 w-auto"
            />
          </div>

          <div className="logo-item opacity-0 translate-y-4 transition-all duration-700 ease-out filter grayscale hover:grayscale-0 hover:scale-110">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAr0lEQVR4Ae2WwQ2AIAxFHYBJdBAvDMMMnJnDPWQTduBee+jJ5MdiE5sYDu8k9kHTQpc9xU/xFU7hUikymTmEzESwNsm3caEEpgeyrN0YEgoQQlFgOkNKGtMVQigjA8PCBoJ0pgrdLBRZAgEiKCSbEOw86NOvFkqVKU6GT6oXwnRq+/StsNx+qgPC6i/0T6l30djbwr/x/a82x8vb4XmyP8AnrVhoHzGKfsSYU9tfhBerqMWpVFuYswAAAABJRU5ErkJggg=="
              alt="Agora.io logo"
              width={120}
              height={40}
              className="object-contain h-8 w-auto"
            />
          </div>


        </div>
      </div>
    </div>
  )
}

