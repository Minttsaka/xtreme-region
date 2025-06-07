'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent,  } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Book, GraduationCap, School} from 'lucide-react'
import Link from 'next/link'
import {  Prisma, } from '@prisma/client'


type EducationLevel = Prisma.EducationLevelGetPayload<{
  include:{
    classes:{
      include:{
        subjects:true
      }
    }
  }
}>

type Class  = Prisma.ClassGetPayload<{
  include:{
    subjects:true
  }
}>

const EducationLevelCard: React.FC<{ level: EducationLevel; onClick: () => void }> = ({ level, onClick }) => (
  <Card className="shadow overflow-hidden cursor-pointer transition-all hover:shadow-lg" onClick={onClick}>
    <CardContent className="p-6 flex flex-col items-center text-center">
      {level.name ==="TERTIARY" ? (
        <School className="w-16 h-16 text-indigo-500 mb-4" />
      ) : (
        <GraduationCap className="w-16 h-16 text-purple-500 mb-4" />
      )}
      <h3 className="text-xl font-semibold text-indigo-700 mb-2">{level.name}</h3>
      <p className="text-sm text-indigo-600">{ `Choose from ${level.classes.length} classes` } </p>
    </CardContent>
  </Card>
)

const GradeCard: React.FC<{ grade: Class ,channel:string }> = ({ grade, channel }) => (
  <Link href={`/i/channel/${grade.id}/${channel}`} target='__blank'>
    <Card className="shadow overflow-hidden cursor-pointer transition-all hover:shadow-lg">
      <CardContent className="p-4 flex flex-col items-center text-center">
        <Book className="w-10 h-10 text-pink-500 mb-2" />
        <h3 className="text-lg font-semibold text-pink-700 mb-1">{grade.name}</h3>
        <p className="text-xs text-pink-600">{grade.subjects.length} subjects available</p>
      </CardContent>
    </Card>
  </Link>
)

const EducationLevelSelector: React.FC<{
  educationLevels:EducationLevel[],
  channel:string
}> = ({ 
  educationLevels, 
  channel 
}) => {
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel | null>(null)

  return (
    <div className="p-6 container mx-auto overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-lg font-bold text-indigo-800 mb-2">Education Level Selector</h1>
        <p className="text-indigo-600">Choose your education level and start creating engaging lessons!</p>
      </motion.div>

      {!selectedLevel && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {educationLevels.map((level) => (
            <EducationLevelCard key={level.id} level={level} onClick={() => setSelectedLevel(level)} />
          ))}
        </motion.div>
      )}

      {selectedLevel && (
        <>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Button
              variant="outline"
              onClick={() => setSelectedLevel(null)}
              className="mb-4"
            >
              Back to Education Levels
            </Button>
            <h2 className="text-lg font-semibold text-indigo-700 mb-2">{selectedLevel.name}</h2>
            <p className="text-indigo-600">Select a grade to view available subjects:</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {selectedLevel.classes.map((grade) => (
              <GradeCard key={grade.id} grade={grade} channel={channel} />
            ))}
          </motion.div>
        </>
      )}

    </div>
  )
}

export default EducationLevelSelector

