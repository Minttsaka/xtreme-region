import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, ExternalLink } from 'lucide-react'

interface Resource {
  id: string
  title: string
  type: 'pdf' | 'link'
  url: string
}

interface CourseResourcesProps {
  resources: Resource[]
}

const CourseResources: React.FC<CourseResourcesProps> = ({ resources }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="bg-white rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-indigo-800">Course Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {resources.map((resource) => (
              <motion.li
                key={resource.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between border rounded-md p-2"
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  <span className="text-xs font-medium text-indigo-700">{resource.title}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs"
                  onClick={() => window.open(resource.url, '_blank')}
                >
                  {resource.type === 'pdf' ? (
                    <>
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Open
                    </>
                  )}
                </Button>
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default CourseResources

