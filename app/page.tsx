
import { Suspense } from 'react';
import { InfiniteScroll } from "@/components/landing/FirstBlog";
import { GoogleGeminiEffectDemo } from "@/components/landing/Gemini";
import  { TimelineDemo } from "@/components/landing/InnovativeEdTechSection";
import { SpotlightReview } from "@/components/landing/SportLight";
import TrustedBy from "@/components/landing/TrustedBy";
import { AutoTriggerTabs } from "@/components/landing/auto-trigger-tabs";
import EdutechFeatures from "@/components/landing/EdutechFeatures";
import ScrollableFeatures from "@/components/landing/DraggableFeatures";
import { SatisfiedCustomers } from "@/components/landing/SatisfiedCustomers";
import BlogSection from "@/components/landing/BlogSection";
import EnhancedFooter from "@/components/landing/footer/EnhancedFooter";
import Footer from "@/components/landing/footer/Footer";
import { prisma } from "@/lib/db";
import SupportChat from "@/components/landing/Support";

export default  async function Home() {

  const lessons = await prisma.lesson.findMany({

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
      })

    const randomLesson = lessons.length > 0 ? lessons[Math.floor(Math.random() * lessons.length)] : null

  return (
    <main 
    className="bg-gradient-to-b from-slate-50 to-blue-50"
   >
      <SpotlightReview />
      <EdutechFeatures lesson={randomLesson} />
      <TrustedBy />
      <ScrollableFeatures />
      <InfiniteScroll />
      <SatisfiedCustomers />
      <BlogSection />
      <AutoTriggerTabs />
      <TimelineDemo />
      {/* <main className="relative overflow-hidden bg-black text-white">
        <VideoBackground />
         <AnimatedTestimonialsDemo />
      </main> */}
      <Suspense fallback={<div>Loading...</div>}>
       <SupportChat />
      </Suspense>
      <GoogleGeminiEffectDemo />
      <Footer />
      <EnhancedFooter />
    </main>
  );
}
