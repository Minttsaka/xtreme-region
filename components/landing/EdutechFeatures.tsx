import Link from "next/link"
import { MessageSquare, } from "lucide-react"

import { CustomButton } from "../ui/CustomButton"
import { Prisma } from "@prisma/client"
import DemoLesson from "../lesson/DemoLesson"
import DemoLessonDialog from "../lesson/DemoDialog"

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

export default function EducationFeatures({lesson}:{lesson:Lesson}) {
  return (
    <div className="flex  flex-col ">
      <main className="flex-1">
        <section className="relative">
          <div className="absolute inset-0 ">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          </div>

          <div className="relative max-w-7xl  px-10 xl:px-0  mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-10">
              <div className="space-y-8">
                <div className="space-y-6">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7x font-light leading-tight">
                    Interactive learning{" "}
                    <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                     through voice.
                    </span>
                  </h1>
                  <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                    Experience your study materials through natural voice conversations. Our AI enables students and
                    instructors to interact with educational content in an intuitive, conversational way.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <CustomButton hasArrow={true} variant="outline" size="lg" className="gap-2 hover:text-white">
                    <Link href="/demo">Start Learning</Link>
                  </CustomButton>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-8">
                  <div className="space-y-2">
                    <h4 className="text-4xl font-bold text-primary">2+</h4>
                    <p className="text-sm text-muted-foreground">Realistic Voices</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-4xl font-bold text-primary">24/7</h4>
                    <p className="text-sm text-muted-foreground">Learning Support</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-4xl font-bold text-primary">10+</h4>
                    <p className="text-sm text-muted-foreground">Lessons</p>
                  </div>
                </div>
              </div>
              <div className="relative ">
                
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur-3xl" />
                <div className="relative bg-card rounded-2xl border p-6 shadow-2xl">
                  <DemoLessonDialog lesson={lesson}/>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                    </div>
                    <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 flex items-center justify-center">
                      <MessageSquare className="h-24 w-24 text-primary/40" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2">
                          <div className="h-2 rounded-full bg-primary/20" />
                          <div className="h-2 w-2/3 rounded-full bg-muted" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

    </div>
  )
}
