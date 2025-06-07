import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Folder } from 'lucide-react'
import { CollaboratedCourse, CourseList } from '@/types/course'

interface UnitListProps {
  courses: CourseList[]
  onSelectCourse: (course:CourseList) => void
  selectedCourse: CourseList,
  collaboratedCourses:CollaboratedCourse[]
}

const UnitList: React.FC<UnitListProps> = ({ courses, collaboratedCourses, onSelectCourse, selectedCourse }) => {
  return (
    <Card className="w-full md:w-72 bg-gradient-to-br from-blue-100 to-green-100">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-blue-800">courses</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48 md:h-[calc(100vh-12rem)]">
          <h2 className='font-bold border-b border-b-green-500 mb-2'>Collabo</h2>
          <ul className='space-y-2'>
            {collaboratedCourses?.length === 0 && 
            <p className='text-xs'>No collaboration.</p>}
            {collaboratedCourses?.map((collabo) => (
              <motion.li
                key={collabo.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={() => onSelectCourse(collabo.course as CourseList)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                    selectedCourse?.id === collabo.course?.id
                      ? 'bg-blue-200 text-blue-800'
                      : 'text-gray-700 hover:bg-blue-100'
                  }`}
                >
                  <span className="flex items-center font-medium">
                    <Folder className="w-4 h-4 mr-2" />
                    {collabo.course?.title}
                  </span>
                  <p className="mt-1 text-xs text-gray-600">{collabo.course?.content}</p>
                </button>
              </motion.li>
            ))}
          </ul>
          <h2 className='font-bold border-b border-b-green-500 my-2'>Your Courses</h2>
          <ul className="space-y-2">
            {courses?.map((course) => (
              <motion.li
                key={course.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={() => onSelectCourse(course)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                    selectedCourse?.id === course.id
                      ? 'bg-blue-200 text-blue-800'
                      : 'text-gray-700 hover:bg-blue-100'
                  }`}
                >
                  <span className="flex items-center font-medium">
                    <Folder className="w-4 h-4 mr-2" />
                    {course.title}
                  </span>
                  <p className="mt-1 text-xs text-gray-600">{course.content}</p>
                </button>
              </motion.li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default UnitList

