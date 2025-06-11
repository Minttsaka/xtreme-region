
import ScheduleMeeting from '@/components/meeting/schedule/ScheduleMeeting'
import React from 'react'

export default function page() {
  return (
    <div className='pt-20 md:mt-0 min-h-screen bg-gray-50'>
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white ">
          <h1 className="text-3xl font-bold">Schedule Meeting</h1>
          <p className="mt-2 text-blue-100">Create your professional meeting in just a few steps</p>
        </div>
      <ScheduleMeeting />
    </div>
  )
}
