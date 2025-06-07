'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import SubjectList from './SubjectList'
import UnitList from './UnitList'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Video, Book, Loader, } from 'lucide-react'
import ScheduleClass from '../lessoncreation/LessonCreator'
import CourseDisplay from '@/components/course/CourseDisplay'
import { CourseUser } from '@/types/channel'
import { CollaboratedCourse, CourseList } from '@/types/course'
import { Subject } from '@/types/subject'

const AdorableLessonManager: React.FC <{
  subjects:Subject[],
  channel:string ,
  collaboratedCourses:CollaboratedCourse[]
  user: CourseUser | null  
}> = ({
  subjects,
  channel,
  collaboratedCourses,
  user
}) => {

  const [selectedSubject, setSelectedSubject] = useState<Subject>()
  const [selectedCourse, setCourse] = useState<CourseList>()
  const [courseList, setCoursesList] = useState<CourseList[]>([])
  const [loading , setLoading ] = useState(false)


  const handleSelectSubject = (subject: Subject) => {
    setSelectedSubject(subject)
  }

  const handleSelectCourse = (course: CourseList) => {
    setCourse(course)
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 md:p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SubjectList
          setCoursesList={setCoursesList}
          channel={channel}
          setLoading={setLoading}
          subjects={subjects}
          onSelectSubject={handleSelectSubject}
          selectedSubjectId={selectedSubject?.id as string}
        />
      </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 md:mt-0 md:ml-4"
        >
        {loading && <Loader className='animate-spin' />}
          <UnitList
            collaboratedCourses={collaboratedCourses}
            courses={courseList as CourseList[]}
            onSelectCourse={handleSelectCourse}
            selectedCourse={selectedCourse as CourseList}
          />
        </motion.div>
      {selectedCourse && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-4 md:mt-0 md:ml-4 flex-1"
        >
          <Card className="h-full bg-gradient-to-br from-indigo-100 to-blue-100">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-indigo-800">{selectedCourse.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="lessons">
                <TabsList className="mb-4">
                  <TabsTrigger value="lessons" className="text-xs">
                    <Video className="w-4 h-4 mr-2" />
                    Course
                  </TabsTrigger>
                  <TabsTrigger value="create" className="text-xs">
                    <Book className="w-4 h-4 mr-2" />
                    Create Lesson
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="lessons">
                  <ScrollArea>
                    <CourseDisplay user={user} course={selectedCourse} />
                    {/* <CourseAnalytics courseId={selectedCourse.id} /> */}
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="create">
                  <ScrollArea className="h-[calc(100vh-20rem)] md:h-[calc(100vh-16rem)]">
                    <ScheduleClass  
                    courseId={selectedCourse.id} 
                    resources={selectedSubject?.subject?.resource.map(r => r) ?? []}/>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

export default AdorableLessonManager

