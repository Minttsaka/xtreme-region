import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface TipsModalProps {
  isOpen: boolean
  onClose: () => void
}

const steps = [
  {
    title: "Create Your First Lesson",
    description: "Start by creating an engaging lesson. Choose a topic, add multimedia content, and set learning objectives.",
    img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx186LnVZxRiklMAMNfkSvxv5X0tSzABHxHozn3fl4EOGG1do1z5el_G1kSGnvmMceM-4&usqp=CAU",
    action: "Create Lesson"
  },
  {
    title: "Organize Subjects",
    description: "Group your lessons into subjects. This helps students navigate your content more easily.",
    img:"https://img.freepik.com/premium-psd/e-learning-electronic-learning-3d-illustration-concept_380580-279.jpg",
    action: "Add Subject"
  },
  {
    title: "Upload Resources",
    description: "Enhance your lessons with additional resources like PDFs, worksheets, or external links.",
    img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx186LnVZxRiklMAMNfkSvxv5X0tSzABHxHozn3fl4EOGG1do1z5el_G1kSGnvmMceM-4&usqp=CAU",
    action: "Upload Resource"
  },
  {
    title: "Set Up Live Sessions",
    description: "Schedule live sessions to interact with your students in real-time.",
    img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx186LnVZxRiklMAMNfkSvxv5X0tSzABHxHozn3fl4EOGG1do1z5el_G1kSGnvmMceM-4&usqp=CAU",
    action: "Schedule Session"
  },
  {
    title: "Promote Your Channel",
    description: "Share your channel on social media and educational forums to attract more students.",
    img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx186LnVZxRiklMAMNfkSvxv5X0tSzABHxHozn3fl4EOGG1do1z5el_G1kSGnvmMceM-4&usqp=CAU",
    action: "Share Channel"
  }
]

const TipsModal: React.FC<TipsModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0)

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white shadow-lg p-8 max-w-md w-full"
          >
            <img src={steps[currentStep].img}  className='rounded-full mb-5'/>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-indigo-700">Get Started with Your Channel</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg text-indigo-600">{steps[currentStep].title}</h3>
                <span className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{steps[currentStep].description}</p>
              {/* <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                {steps[currentStep].action}
              </Button> */}
            </div>
            <div className="flex justify-between">
              <Button
                onClick={prevStep}
                disabled={currentStep === 0}
                variant="outline"
                className="flex rounded-3xl items-center"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button
                onClick={nextStep}
                className="bg-green-600 rounded-3xl hover:bg-green-700 text-white flex items-center"
              >
                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default TipsModal

