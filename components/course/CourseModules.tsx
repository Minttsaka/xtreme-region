import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle,PlayCircle, FileText, HelpCircle } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  type: 'video' | 'quiz' | 'reading'
  duration: string
  completed: boolean
}

interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

interface CourseModulesProps {
  modules: Module[]
}

const CourseModules: React.FC<CourseModulesProps> = ({ modules }) => {
  const [expandedModule, setExpandedModule] = useState<string | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <Accordion
        type="single"
        collapsible
        value={expandedModule as string}
        onValueChange={setExpandedModule}
      >
        {modules.map((module) => (
          <AccordionItem key={module.id} value={module.id}>
            <AccordionTrigger className="px-4 py-2 text-sm font-medium text-indigo-800 hover:bg-indigo-50">
              {module.title}
            </AccordionTrigger>
            <AccordionContent>
              <AnimatePresence>
                {expandedModule === module.id && (
                  <motion.ul
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2 p-2"
                  >
                    {module.lessons.map((lesson) => (
                      <motion.li
                        key={lesson.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-between bg-gray-50 rounded-md p-2"
                      >
                        <div className="flex items-center space-x-2">
                          {lesson.type === 'video' && <PlayCircle className="w-4 h-4 text-blue-500" />}
                          {lesson.type === 'quiz' && <HelpCircle className="w-4 h-4 text-green-500" />}
                          {lesson.type === 'reading' && <FileText className="w-4 h-4 text-yellow-500" />}
                          <span className="text-xs font-medium text-indigo-700">{lesson.title}</span>
                          <Badge variant="secondary" className="text-xs">
                            {lesson.duration}
                          </Badge>
                        </div>
                        <div>
                          {lesson.completed ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Button size="sm" variant="ghost" className="text-xs">
                              Start
                            </Button>
                          )}
                        </div>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.div>
  )
}

export default CourseModules

