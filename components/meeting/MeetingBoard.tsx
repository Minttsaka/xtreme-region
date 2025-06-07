import React from 'react'
import { CustomButton } from '../ui/CustomButton'
import { Badge } from '../ui/badge'
import Link from 'next/link'

export default function MeetingBoard() {
  return (
    <div className='md:p-10 bg-slate-50'>
      <div className="mb-10">
          <div className="bg-[#0d1b2a] text-white p-8 rounded-xl relative overflow-hidden border border-[#2a2a4a] shadow-[0_0_20px_rgba(0,200,255,0.15)]">
             <div className="p-3 md:p-8 relative z-10">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                    <Badge className="bg-[#2a2a4a] text-[#00c8ff] mb-3 border-none">Coming Soon</Badge>
                    <h2 className="text-2xl font-bold text-white mb-2">Introducing AI Meeting Prep.</h2>
                    <p className="text-[#a0a0c8] max-w-2xl">
                    Were excited to announce that Xtreme-region is planning to introduce advanced meeting scheduling
                    capabilities that will allow users to prepare meeting in advance with ai Assistance. If you are running late or cant make it
                    , AI will host and interact for you, ensuring everyone stays informed and engaged.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-[#2a2a4a] border-[#3a3a5a] text-[#00c8ff]">
                        AI Scheduling
                    </Badge>
                    <Badge variant="outline" className="bg-[#2a2a4a] border-[#3a3a5a] text-[#00c8ff]">
                        Agenda
                    </Badge>
                    <Badge variant="outline" className="bg-[#2a2a4a] border-[#3a3a5a] text-[#00c8ff]">
                        Calendar Integration
                    </Badge>
                    </div>
                </div>

                <div className="md:w-64 flex-shrink-0">
                    <div className="bg-[#1a1a2e] p-4 rounded-lg border border-[#2a2a4a]">
                    
                    <img src="https://static.tildacdn.com/tild6631-6665-4535-b064-643564613465/__.jpg?height=640&width=480" alt="Blog Feature"  className="object-cover"  />
                    </div>
                </div>
                </div>
                <div className="pt-4 space-x-1">
                  <Link href={`${process.env.NEXT_PUBLIC_CONFERENCE_URL}/join`} target='__blank'>
                    <CustomButton className="bg-green-500 hover:bg-[#33d6ff] text-white font-medium border-b-2 border-[#0099cc]">
                      Join
                    </CustomButton>
                  </Link>
                  <Link href={'/i/schedule'}>
                    <CustomButton className="bg-[#00c8ff] hover:bg-[#33d6ff] text-white font-medium border-b-2 border-[#0099cc]">
                      Schedule
                    </CustomButton>
                  </Link>
                </div>
            </div>
           

              <div className="absolute bottom-0 right-0 w-full h-full opacity-10">
                {/* Hexagon pattern simulation */}
                <div className="absolute inset-0">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-16 h-16 border border-[#00c8ff] rotate-45"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        opacity: Math.random() * 0.5 + 0.1,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
        </div>
    </div>
  )
}
