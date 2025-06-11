"use client"
import dynamic from 'next/dynamic'
import React from 'react'

const RedirectPage = dynamic(() => import("./RedirectPage"), { ssr: false })
export default function Redirect({id}:{id:string}) {
  return (
    <div>
      <RedirectPage id={id} />
    </div>
  )
}
