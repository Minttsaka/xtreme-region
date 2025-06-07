import React from 'react'
import { motion } from 'framer-motion'
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, Award } from 'lucide-react'

interface CourseHeaderProps {
  title: string
  description: string
  progress: number
  duration: string
  certificateAvailable: boolean
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ title, description, progress, duration, certificateAvailable }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-indigo-100 to-purple-100 p-6 rounded-lg shadow-md"
    >
      <h1 className="text-xl font-bold text-indigo-800 mb-2">{title}</h1>
      <p className="text-xs text-indigo-600 mb-4">{description}</p>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-xs text-indigo-700">
            <Clock className="w-3 h-3 mr-1" />
            {duration}
          </div>
          {certificateAvailable && (
            <div className="flex items-center text-xs text-indigo-700">
              <Award className="w-3 h-3 mr-1" />
              Certificate
            </div>
          )}
        </div>
        <Button size="sm" className="text-xs bg-green-400 rounded-3xl">
          <BookOpen className="w-3 h-3 mr-1" />
          Continue Learning
        </Button>
      </div>
      <div className="flex items-center">
        <Progress value={progress} className="flex-grow mr-4" />
        <span className="text-xs font-medium text-indigo-800">{progress}% Complete</span>
      </div>
    </motion.div>
  )
}

export default CourseHeader

