import Image from 'next/image'
import React from 'react'

export default function Logo() {
  return (
    <div>
      <Image src={'/fusion.png'} height={30} width={30} alt="xtreme-region" />
    </div>
  )
}
