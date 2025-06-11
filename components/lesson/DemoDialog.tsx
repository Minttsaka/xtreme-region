"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent,  CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import DemoLesson from "./DemoLesson"
import { CustomButton } from "../ui/CustomButton"
import { Prisma } from "@prisma/client"

type Lesson = Prisma.LessonGetPayload<{
  include: {
    finalSlide: {
      include: {
        notes: true,
      }
    },
    user: true,
    resources: {
      include: {
        resource: true
      }
    }
  }
}>

export default function DemoLessonDialog({ lesson }:{ lesson:Lesson }) {
 

  return (
    <div className="flex bg-gray-50">
      <Dialog>
        <DialogTrigger asChild>
          <CustomButton  className=" hover:bg-blue-700">
            Demo
          </CustomButton>
        </DialogTrigger>
        <DialogContent className="w-full max-w-[95vw] lg:max-w-[1100px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{lesson.title}</DialogTitle>
            <DialogDescription>{lesson.description}</DialogDescription>
          </DialogHeader>
          <DemoLesson lesson={lesson} />
          <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lesson Creator</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={lesson.user.image || "/placeholder.svg"} alt={lesson.user.name} />
                        <AvatarFallback>
                          {lesson.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{lesson.user.name}</h3>
                        <p className="text-sm text-muted-foreground">{lesson.user.career}</p>
                      </div>
                    </div>
                    <Separator />

                    <div>
                      <h4 className="font-medium mb-2">About the Instructor</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{lesson.user.bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
