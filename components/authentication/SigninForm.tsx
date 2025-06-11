"use client"

import { type FormEvent,  useState } from "react"
import { motion } from "framer-motion"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
//import { useSearchParams } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { useActionState } from "react"
import { authenticate, loginWithGoogle } from "@/app/actions/auth"
import { CustomButton } from "@/components/ui/CustomButton"
import {  CheckCircle } from "lucide-react"
import { checkConferenceAuth } from "@/app/utils/helpers"
import Logo from "../Logo"
import { toast } from "sonner"
import { signIn } from "next-auth/react"
import Link from "next/link"

export function SigninForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [ isPending] = useActionState(authenticate, undefined)
  // const searchParams = useSearchParams()
  // const callbackUrl = searchParams.get("callbackUrl")



  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {

        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
        })

        if (!result?.ok) {
        toast.error(result?.error)
        return;
      }

      if(result.error === "Configuration"){
        console.error(result.error)
        toast("Please verify your email first.")
        return
      }

      if(result.ok){
        checkConferenceAuth()
        window.location.reload()
      }

    } catch (error) {

      console.error(error)
     
      if (error instanceof Error && error.message.includes("Invalid credentials")) {
        toast.error(error.message)
      }

    }
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
    <div className="grid md:grid-cols-2 h-screen bg-gray-50">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb2e_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb2e_1px,transparent_1px)] bg-[size:14px_24px] animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-blue-50/20" />
      </div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex items-center w-full justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 relative"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="mx-auto w-full max-w-md relative z-10">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex"
            >
              <Link className="font-normal flex space-x-2 items-center text-sm mr-4 text-gray-800 px-2 py-1" href="/">
                <span className="font-medium bg-gradient-to-r from-primary to-green-500 text-transparent bg-clip-text">
                  XTREME-REGION
                </span>
              </Link>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-8 text-3xl font-bold leading-9 tracking-tight bg-gradient-to-r from-gray-800 to-gray-600 text-transparent bg-clip-text"
            >
              Sign in to your account
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10"
          >
            <div className="bg-white/80 p-8 rounded-2xl backdrop-blur-sm border border-gray-200 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label className="text-gray-700">Email address</Label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="hello@example.com"
                    className="mt-2 bg-white/50 border-gray-300 text-gray-800 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <Label className="text-gray-700">Password</Label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="mt-2 bg-white/50 border-gray-300 text-gray-800 placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <CustomButton type="submit" className="w-full" disabled={!!isPending}>
                    {isPending ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-3 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2.93 6.343A8.003 8.003 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3.93-1.595zM12 20a8.003 8.003 0 01-6.343-2.93l-3.93 1.595A11.95 11.95 0 0012 24v-4zm6.343-2.93A8.003 8.003 0 0120 12h4c0 3.042-1.135 5.824-3 7.938l-3.657-1.862zM20 12a8.003 8.003 0 01-2.93-6.343l3.93-1.595A11.95 11.95 0 0024 12h-4z"
                          ></path>
                        </svg>
                        Signing in...
                      </span>
                    ) : (
                      "Sign in"
                    )}

                  </CustomButton>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <button
                  onClick={signWithGoogle}
                  className="mt-6 w-full relative overflow-hidden group rounded-full bg-white hover:bg-gray-50 text-gray-900 px-7 py-2 leading-none flex items-center justify-center gap-2 transition-colors border border-gray-300 shadow-sm"
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
                  Google
                  <span className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                </button>
              </div>
            </div>

            <p className="text-center mt-6 text-sm text-gray-600">
              Dont have an account?{" "}
              <a href="/signup" className="text-primary hover:text-primary/80 font-medium">
                Sign up
              </a>
            </p>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="relative hidden md:flex border-l border-gray-200 overflow-hidden bg-gradient-to-br from-white to-gray-100 items-center justify-center"
      >
        <div className="relative w-full z-20 hidden md:flex border-l border-gray-200 overflow-hidden items-center justify-center">
          <div className="max-w-sm mx-auto">
            <div className="flex justify-center">
             <Logo />
            </div>
            <h3 className="text-2xl font-bold text-center mt-6 text-gray-800">DREAMZ COME TRUE</h3>

            <div className="mt-12 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm text-gray-600">INNOVATION</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm text-gray-600">PROFESSIONAL</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm text-gray-600">CAPABLE</p>
              </div>
            </div>
          </div>

          {/* Decorative lines */}
          <svg
            width="1595"
            height="2"
            viewBox="0 0 1595 2"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute w-full object-contain pointer-events-none top-20"
          >
            <path d="M0 1H1594.5" stroke="url(#line-path-gradient-top)" strokeDasharray="8 8"></path>
            <defs>
              <linearGradient
                id="line-path-gradient-top"
                x1="0"
                y1="1.5"
                x2="1594.5"
                y2="1.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" stopOpacity="0"></stop>
                <stop offset="0.2" stopColor="#d1d5db"></stop>
                <stop offset="0.8" stopColor="#d1d5db"></stop>
                <stop offset="1" stopColor="white" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
          </svg>
          <svg
            width="1595"
            height="2"
            viewBox="0 0 1595 2"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute w-full object-contain pointer-events-none bottom-20"
          >
            <path d="M0 1H1594.5" stroke="url(#line-path-gradient-bottom)" strokeDasharray="8 8"></path>
            <defs>
              <linearGradient
                id="line-path-gradient-bottom"
                x1="0"
                y1="1.5"
                x2="1594.5"
                y2="1.5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="white" stopOpacity="0"></stop>
                <stop offset="0.2" stopColor="#d1d5db"></stop>
                <stop offset="0.8" stopColor="#d1d5db"></stop>
                <stop offset="1" stopColor="white" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-grid-gray-200/[0.2] bg-[size:50px_50px]" />
        <div className="absolute inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,white)]" />
      </motion.div>

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
        @keyframes tilt {
            0%, 50%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(0.5deg); }
            75% { transform: rotate(-0.5deg); }
        }
        .animate-tilt {
            animation: tilt 10s infinite linear;
        }
    `}</style>
    </div>
  )
}


