'use client'

import Link from "next/link"
import { CustomButton } from "../ui/CustomButton"

export default function AnimatedButtons() {

  return (
    <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
      {/* Get Started Button */}
      <Link
      href={'/signup'}       
      >

        <CustomButton className="relative flex items-center gap-2">
          <span>Sign Up</span>
        </CustomButton>

      </Link>

      {/* Learn More Button */}
      <CustomButton

      >
        <span className="relative z-10 text-sm px-4 py-2">Learn More</span>

       
      </CustomButton>
    </div>
  )
}

