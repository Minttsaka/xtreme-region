"use client"

import Redirect from '@/components/redirect/Redirect'
import React from 'react'

export default async function page( {
  params
}: {
  params:  Promise<{ id: string }>
}) {

  const id = (await params).id
  return (
    <div>
      <Redirect id={id} />
    </div>
  )
}