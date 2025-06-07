'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

const blogPosts = [
  {
    title: "EduConnect Global Launches Revolutionary Live Streaming Platform",
    date: "June 15, 2023",
    author: "Sarah Johnson",
    content: "EduConnect Global, the leading innovator in educational technology, has announced the launch of its groundbreaking live streaming platform designed to connect students and educators worldwide. This state-of-the-art system allows for real-time interaction, collaborative learning, and access to world-class educational resources, regardless of geographical boundaries. The platform's cutting-edge features include AI-powered translation for seamless communication across languages, virtual reality integration for immersive learning experiences, and adaptive learning algorithms that personalize content for each student. With this launch, EduConnect Global is set to revolutionize the landscape of global education, making high-quality learning accessible to millions around the world."
  },
  {
    title: "Global Education Summit 2023: EduConnect Global Takes Center Stage",
    date: "July 2, 2023",
    author: "Michael Chen",
    content: "The annual Global Education Summit, held virtually this year, saw EduConnect Global emerge as a frontrunner in shaping the future of education. CEO Dr. Emily Zhao delivered a compelling keynote address, highlighting the transformative power of borderless education enabled by EduConnect Global's platform. The summit, attended by education ministers, tech leaders, and renowned academicians from over 50 countries, focused on leveraging technology to bridge educational gaps worldwide. EduConnect Global's live demonstrations showcased how their platform is being used in refugee camps, remote villages, and urban centers alike, illustrating its potential to democratize education on an unprecedented scale. The company also unveiled plans for integrating blockchain technology to offer verifiable, tamper-proof educational credentials, further cementing its position at the forefront of edutech innovation."
  },
  {
    title: "EduConnect Global Partners with Top Universities for Exclusive Content",
    date: "August 10, 2023",
    author: "Alex Tanner",
    content: "In a move set to elevate the quality of online education, EduConnect Global has announced strategic partnerships with five of the world's top-ranked universities. This collaboration will bring exclusive, cutting-edge content to the EduConnect Global platform, covering fields ranging from artificial intelligence and sustainable development to quantum computing and bioengineering. The partnership not only enriches the platform's course offerings but also allows students worldwide to engage with leading academics and researchers through live, interactive sessions. This initiative is expected to significantly boost the platform's appeal, offering unprecedented access to elite education that was previously confined to the hallowed halls of prestigious institutions. The first series of exclusive courses is scheduled to launch next month, with more to be rolled out throughout the academic year."
  }
]

export default function BlogPost() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="mx-auto max-w-6xl my-20 grid gap-8 md:grid-cols-3">
       {blogPosts.map((post, index) => (
           
      <motion.article
        key={index}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex h-full flex-col overflow-hidden rounded-lg bg-gray-950 p-6 backdrop-blur-sm"
      >
        <h2 className="mb-2 text-lg font-bold text-white">{post.title}</h2>
        <div className="mb-4 flex items-center justify-between text-sm text-gray-400">
          <span>{post.date}</span>
          <span>By {post.author}</span>
        </div>
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : '100px' }}
          className="relative flex-grow overflow-hidden"
        >
          <p className="text-sm text-gray-300">{post.content}</p>
          {!isExpanded && (
            <div className="absolute bottom-0 left-0 h-16 w-full bg-gradient-to-t from-gray-800 to-transparent" />
          )}
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 flex items-center text-sm text-white hover:text-gray-300"
        >
          {isExpanded ? 'Read less' : 'Read more'}
          <ChevronDown
            className={`ml-1 h-4 w-4 transform transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </motion.button>
      </motion.article>
          ))}
    </div>
  )
}

