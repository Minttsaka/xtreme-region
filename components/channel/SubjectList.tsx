
"use client"
import React, { Dispatch, SetStateAction, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Book, Check, ChevronDown, ChevronRight, Loader2, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { addCourseToUser, fetchCourses } from '@/app/actions/actions'
import { CourseList } from '@/types/course'
import { Subject } from '@/types/subject'
import { CourseUser } from '@/types/channel'

interface SubjectListProps {
  subjects: Subject[]
  user:CourseUser
  channel:string
  setLoading:Dispatch<SetStateAction<boolean>>
  setCoursesList:Dispatch<SetStateAction<CourseList[]>>
  onSelectSubject: (subject:Subject) => void
  selectedSubjectId: string
}

  type AddCourseParams = {
    courseId: string
    channelId: string
    subjectId:string
    title: string
    content: string | null
    thumbnail: string | null
    startDate: Date
    duration: number
  }

 type Course = {
  id: string;
  subjectId: string;
  createdAt: Date;
  title: string;
  thumbnail: string | null;
  content: string | null;
  updatedAt: Date;
  userId: string;
  userEmail: string;
  duration?: number;
  
};

const SubjectList: React.FC<SubjectListProps> = ({ 
  subjects, 
  onSelectSubject,
  channel, 
  user,
  selectedSubjectId,
  setCoursesList,
  setLoading
 }) => {
  // State to track which subject dropdowns are open
  const [openSubjects, setOpenSubjects] = useState<Record<string, boolean>>({})
  const [isLoading, setIsloading] = useState(false)
  // Toggle dropdown for a subject
  const toggleSubject = async (subject: Subject) => {
    fetchCoursesForSelectedSubject(subject.id)
    onSelectSubject(subject)
    setOpenSubjects(prev => ({
      ...prev,
      [subject.id]: !prev[subject.id]
    }))
  }

  const fetchCoursesForSelectedSubject = async (id:string) =>{

    try {
        setLoading(true)
        const response = await fetchCourses(id)
        setCoursesList(response as CourseList[])
      
    } catch (error) {
      console.error(error)
      
    } finally {
      setLoading(false)
          
    } 
  }
  // Function to add course to UserCourse
  const addCourse = async (course: Course) => {
    try {
      setIsloading(true)
      const response: AddCourseParams = {
        courseId: course.id,
        title: course.title,
        subjectId:selectedSubjectId,
        thumbnail: course.thumbnail,
        content: course.content,
        channelId: channel, // Fallback for channelId
        startDate: new Date(),
        duration: course.duration || 60, // Default duration if not provided
      }
      
      await addCourseToUser(response)
      window.location.reload()
    } catch (error) {
      console.error('Error adding course:', error)
    } finally{
      setIsloading(false)
    }
  }

  return (
    <Card className="w-full md:w-64 bg-gradient-to-br from-pink-100 to-purple-100">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-purple-800">Subjects</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48 md:h-[calc(100vh-12rem)]">
          <ul className="space-y-3">
            {subjects.map((subject) => (
              <li key={subject.id}>
                <Collapsible
                  open={openSubjects[subject.id]}
                  onOpenChange={() => toggleSubject(subject)}
                  className="w-full"
                >
                  <div className="flex items-center">
                    <CollapsibleTrigger asChild>
                      <button
                        className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          selectedSubjectId === subject.id
                            ? 'bg-purple-200 text-purple-800'
                            : 'text-gray-700 hover:bg-purple-100'
                        }`}
                      >
                        <span className="flex items-center">
                          <Book className="w-4 h-4 mr-2" />
                          {subject.subject?.name}
                        </span>
                        {openSubjects[subject.id] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    </CollapsibleTrigger>
                  </div>
                  
                  <CollapsibleContent>
                    <div className="pl-6 mt-1 space-y-1">
                      {subject.courses && subject.courses.length > 0 ? (
                        subject.courses.map((course) => (
                          <motion.div
                            key={course.id}
                            className="flex items-center justify-between bg-white/80 rounded-md p-2 text-xs"
                            whileHover={{ scale: 1.02 }}
                          >
                            <span className="">{course.title}</span>
                            {isLoading ? <Loader2 className='animate-spin' /> :
                            course.userCourse.find(userCourse => userCourse.user.id === user.id) ? <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 rounded-full text-white bg-green-400"
                                title="Add to my courses"
                              >
                                <Check className="h-4 w-4" />
                              </Button> 
                              : 
                              <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 text-purple-700 hover:text-purple-900 hover:bg-purple-100"
                              onClick={() => addCourse(course)}
                              title="Add to my courses"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                             
                            }
                          </motion.div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-500 italic p-2">No courses available</p>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default SubjectList