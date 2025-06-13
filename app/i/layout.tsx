import AdorableEdTechSidebar from "@/components/AdorableEdTechSidebar";
import MobileSideBar from "@/components/MobileSideBar";
import { prisma } from "@/lib/db";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { auth } from "../authhandlers/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Xtreme region",
  description: "Welcome",
  icons:'/fusion.png'
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  
    const session = await auth()
    
    if (!session?.user?.email) {
      redirect("/signin")
    }
    
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    })
   

  const [ subscriptions, recommendedChannels, subscriptionsOfCourses ] = await prisma.$transaction([
    prisma.subscription.findMany({
      where: {
        userId: user?.id,
        channelId:{
          not:null
        }
      },
      include:{
        channel:{
        include: {
          _count: {
            select: {
              subscriptions: true,
            },
          }
        }
        
      },
      }
      
    }),

    prisma.channel.findMany({
      where: {
        userId: {
          not: user?.id,
        },
      },
       include: {
        _count: {
          select: {
            subscriptions: true,
          },
        }
        
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    }),

    prisma.subscription.findMany({
      where:{
        userId:user?.id,
        courseId:{
          not: null
        }
      },
      include:{
        course:{
          include:{
            enrollment: true
          }
      }
    }
    })
  ]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Please log in to access this page.</h1>
      </div>
    );
  }

  return (

    <div className={cn("flex")}>
        <MobileSideBar 
          subscribedChannels={subscriptions}
          subscriptions={subscriptionsOfCourses}
          recommendedChannels={recommendedChannels}
          userData={user}
        />
        <AdorableEdTechSidebar
          subscribedChannels={subscriptions}
          subscriptions={subscriptionsOfCourses}
          recommendedChannels={recommendedChannels}
          userData={user} />
          <div className="mt-8 md:mt-0 w-full overflow-y-auto h-screen">
              {children}  
          </div>
              
    </div>
  );
}
