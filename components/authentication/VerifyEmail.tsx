import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from 'lucide-react'

export function VerifyEmail() {
  return (
    <Card className="w-full max-w-md shadow-none border-none">
          <CardHeader>
            <CardTitle className="text-2xl text-yellow-400 font-bold text-center">Check Your Email</CardTitle>
            <CardDescription className="text-center">We have sent a verification link to your email address</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-center text-sm text-gray-600">
              Please click on the link in the email to verify your account. If you dont see the email, check your spam folder.
            </p>
            <Link className="flex items-center justify-center gap-2" href="https://accounts.google.com/b/0/AddMailService">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Verification Email
            </Button>
            </Link>
          </CardContent>
        </Card>

  )
}

