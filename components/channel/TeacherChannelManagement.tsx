'use client'

import React from 'react'
import { motion, } from 'framer-motion'
import { Card, CardContent,} from "@/components/ui/card"
import { Star, Users, DollarSign, Zap, Rocket, Globe, Trophy,} from 'lucide-react'

const BenefitCard: React.FC<{ icon: React.ElementType; title: string; description: string }> = ({ icon: Icon, title, description }) => (
  <Card className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl overflow-hidden">
    <CardContent className="p-4 flex justify-center items-center text-center h-full">
        <div>
            <Icon className="w-8 h-8 text-purple-500 mb-2" />
            <h3 className="text-sm font-semibold text-purple-700 mb-1">{title}</h3>
            <p className="text-xs text-gray-600">{description}</p>
        </div>
      
    </CardContent>
  </Card>
)

const TeacherChannelManagement: React.FC = () => {
  return (
    <div className="p-6 container mx-auto overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-12"
      >
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          <motion.div
            //style={{ scale }}
            className="relative"
          >
            <Card className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl ">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-indigo-700 mb-2">Boost Your Teaching Impact</h3>
                <p className="text-sm text-indigo-600 mb-4">Create engaging lessons, connect with students, and grow your teaching community!</p>
                <img
                  src="https://cdn3d.iconscout.com/3d/premium/thumb/online-training-course-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--courses-education-study-conference-pack-network-communication-illustrations-6043522.png"
                  alt="Teacher interacting with students online"
                  width={400}
                  height={200}
                  className="rounded-lg mb-4"
                />
              </CardContent>
            </Card>
            <motion.div
              className=" w-16 h-16 bg-yellow-300 rounded-full absolute -top-10"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute -bottom-4 -right-4 w-20 h-20 bg-pink-300 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <BenefitCard
              icon={Star}
              title="Quality Content"
              description="Create and share high-quality lessons with ease"
            />
            <BenefitCard
              icon={Users}
              title="Grow Community"
              description="Build a loyal following of engaged students"
            />
            <BenefitCard
              icon={DollarSign}
              title="Monetize Skills"
              description="Turn your expertise into a rewarding income stream"
            />
            <BenefitCard
              icon={Zap}
              title="Instant Feedback"
              description="Get real-time insights on your teaching impact"
            />
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 mt-5 gap-6">
            <Card className="bg-gradient-to-br from-green-100 to-blue-100 rounded-xl overflow-hidden">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Rocket className="w-10 h-10 text-green-500 mb-2" />
                <h3 className="text-sm font-semibold text-green-700 mb-1">Interactive Lessons</h3>
                <p className="text-xs text-gray-600">Engage students with interactive quizzes, polls, and live demonstrations</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl overflow-hidden">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Globe className="w-10 h-10 text-yellow-500 mb-2" />
                <h3 className="text-sm font-semibold text-yellow-700 mb-1">Global Reach</h3>
                <p className="text-xs text-gray-600">Connect with learners from around the world, breaking geographical barriers</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl overflow-hidden">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Trophy className="w-10 h-10 text-purple-500 mb-2" />
                <h3 className="text-sm font-semibold text-purple-700 mb-1">Achievements</h3>
                <p className="text-xs text-gray-600">Motivate students with badges and certificates for completed courses</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default TeacherChannelManagement