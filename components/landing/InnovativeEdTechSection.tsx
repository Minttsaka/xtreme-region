"use client"

import React, { useEffect, useState } from "react";
import { Timeline } from "../ui/timeline";
import { AnimatePresence, motion } from "framer-motion";
import GridBackground from "./GridBackground";

const DynamicText: React.FC<{ texts: string[] }> = ({ texts }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [texts]);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        {texts[index]}
      </motion.span>
    </AnimatePresence>
  );
};


export function TimelineDemo() {
  const data = [
    {
      title: "Online Tutoring",
      content: (
        <div>
          <p className="text-neutral-200 dark:text-neutral-200 text-xs md:text-sm  mb-8">
          Teach students online with ease and earn money from your skills using our platform.
           Flexible tools and simple features help you grow and succeed.
          </p>
          <div className="gap-4 aspect-video">
            <img
              src="https://www.bankrate.com/2021/09/16182324/Online-tutoring-jobs-for-college-students.jpg"
              alt="startup template"
              className="rounded-lg object-cover  shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "School Report Generation",
      content: (
        <div>
          <p className="text-neutral-200 dark:text-neutral-200 text-xs md:text-sm  mb-8">
            Easily create detailed student reports with our AI-powered tools. 
          Save time and ensure accuracy in every report.
          </p>
          {/* <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm  mb-8">
            Lorem ipsum is for people who are too lazy to write copy. But we are
            not. Here are some more example of beautiful designs I built.
          </p> */}
           <div className="gap-4 aspect-video max-h">
            <img
              src="https://images.template.net/wp-content/uploads/2020/02/34-Report-Card-Templates-Word-Docs-PDF-Pages.jpg"
              alt="startup template"
              className="rounded-lg object-cover  shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
    {
      title: "AI-Enhanced Grade Recording System",
      content: (
        <div>
          <p className="text-neutral-200 dark:text-neutral-200 text-xs md:text-sm mb-4">
            Streamline student assessment with cutting-edge AI tools designed to simplify and modernize grade recording.
          </p>
          <div className="mb-8">
            <div className="flex gap-2 items-center text-neutral-200 dark:text-neutral-300 text-xs md:text-sm">
              ✅ Record grades instantly using voice commands—AI captures and logs scores with accuracy.
            </div>
            <div className="flex gap-2 items-center text-neutral-200 dark:text-neutral-300 text-xs md:text-sm">
              ✅ Use image recognition to scan student ID strips for quick, contactless grade input.
            </div>
            <div className="flex gap-2 items-center text-neutral-200 dark:text-neutral-300 text-xs md:text-sm">
              ✅ Automatically organize and store grades securely in a centralized system.
            </div>
            <div className="flex gap-2 items-center text-neutral-200 dark:text-neutral-300 text-xs md:text-sm">
              ✅ Enable real-time syncing with student profiles for transparent performance tracking.
            </div>
            <div className="flex gap-2 items-center text-neutral-200 dark:text-neutral-300 text-xs md:text-sm">
              ✅ Eliminate manual errors and save instructors time with smart AI post-processing.
            </div>
          </div>
          <div className="gap-4 aspect-video">
            <img
              src="https://media.khou.com/assets/KHOU/images/9e799018-411d-480b-9f7d-1b82792a6783/20240813T112350/9e799018-411d-480b-9f7d-1b82792a6783_1920x1080.jpg"
              alt="startup template"
              className="rounded-lg object-cover  shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    }
    ,
  ];
  return (
    <GridBackground>
      <motion.h1
        className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7x font-light leading-tight mt-10 pl-5 text-white mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Empowering Education with{" "}<br />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-purple-500">
          <DynamicText texts={["Innovation", "Technology", "Collaboration"]} />
        </span>
      </motion.h1>
      <Timeline data={data} />
    </GridBackground>
  );
}
