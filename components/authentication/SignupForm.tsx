"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Lock, CheckCircle2, Dot } from "lucide-react"
import { loginWithGoogle, quickSignUp } from "@/app/actions/auth"
import { toast } from "sonner"
import { CustomButton } from "../ui/CustomButton"
import { VerifyEmail } from "./VerifyEmail"

export default function SignupPage() {
  const [step, setStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailVerify, setIsEmailVerify] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const handlePrevStep = () => {
    if (step > 0) setStep(step - 1)
  }

  const steps = [
    { title: "Create Username", icon: User },
    { title: "Add Email", icon: Mail },
    { title: "Set Password", icon: Lock },
  ]

  async function handleSubmit() {
    try {
      setIsLoading(true)
      const result = await quickSignUp(formData)
      toast.success(result.message)

      if (result.success) {
        setIsEmailVerify(true)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if(isEmailVerify){
    return (
    <div className="h-screen flex items-center justify-center">
      <VerifyEmail />
    </div>
    )
  }

  const signWithGoogle = async () => {
      try {
        await loginWithGoogle()
        window.location.reload()
      } catch (error) {
        console.error(error)
      }
    }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb2e_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb2e_1px,transparent_1px)] bg-[size:14px_24px] animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-blue-50/20" />
      </div>

      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <Card className="relative w-full max-w-xl p-8 bg-white/90 border-gray-200 backdrop-blur-sm shadow-xl">
        <div className="text-center mb-8">
        <div className="font-normal flex space-x-2 items-center text-sm mr-4 text-gray-800 px-2 py-1" >
        <span className="font-medium bg-gradient-to-r from-primary to-green-500 text-transparent bg-clip-text">
          XTREME-REGION
        </span>
      </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Sign Up for Excellence
          </h1>
        </div>

        <div className="space-y-6">
          <button
            onClick={signWithGoogle}
            className="w-full relative overflow-hidden group rounded-full bg-white hover:bg-gray-50 text-gray-900 px-4 py-2 leading-none flex items-center justify-center gap-2 transition-colors border border-gray-300 shadow-sm"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign up with Google
            <span className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
          </button>

          <div className="relative">
            <Separator className="bg-gray-200" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-500">
              OR
            </span>
          </div>

          <Progress value={(step / 3) * 100} className="h-2 bg-gray-100" />

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 0 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <User className="text-primary" />
                    <Input
                      name="username"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="bg-white border-gray-300 text-gray-800"
                    />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="text-primary" />
                    <Input
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-white border-gray-300 text-gray-800"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Lock className="text-primary" />
                    <Input
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="bg-white border-gray-300 text-gray-800"
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="text-center space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                  <p className="text-xl font-semibold">Welcome aboard!</p>
                  <p className="text-gray-500">Your journey to exceptional trading begins now.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Process Steps */}
          <div className="space-y-4 mt-8">
            {steps.map((s, index) => (
              <div
                key={index}
                className={`flex items-center text-xs rounded-full gap-4 p-4 transition-all duration-300 ${
                  step === index ? "bg-primary/10 scale-105" : "bg-gray-50"
                }`}
              >
                <div
                  className={`p-3 rounded-full ${
                    step === index ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <s.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold">{s.title}</h4>
                  <p className="text-sm text-gray-500">
                    {index === 0 && "Choose a unique username"}
                    {index === 1 && "Provide your email address"}
                    {index === 2 && "Set a secure password"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            {step > 0 && step < 3 && (
              <CustomButton variant="outline" size="sm" onClick={handlePrevStep}>
                Back
              </CustomButton>
            )}
            {step === 2 && (
              <CustomButton size="sm" onClick={handleSubmit}>
                {isLoading ? <Dot className="animate-fade-in text-green-500" /> : "Sign Up"}
              </CustomButton>
            )}
            {step < 2 && (
              <CustomButton size="sm" className="ml-auto" onClick={handleNextStep}>
                Next
              </CustomButton>
            )}
          </div>
          <p className="text-center mt-6 text-sm text-gray-600">
              Already have an account?{" "}
              <a href="/signin" className="text-primary hover:text-primary/80 font-medium">
                Sign in
              </a>
            </p>
        </div>
      </Card>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}
