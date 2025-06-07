import React from 'react'
import BlogCard from './BlogCard'
import { CustomButton } from '../ui/CustomButton'
import Link from 'next/link'

const BlogSection: React.FC = () => {
  const blogPosts = [
    {
      date: 'Oct 31, 2024',
      title: 'Introducing Snapshot Compare for Tiptap',
      category: 'Documents',
      imageUrl: 'https://home.edweb.net/wp-content/uploads/20230306_technology-event.png?height=200&width=400'
    },
    {
      date: 'Nov 15, 2024',
      title: 'Enhancing Collaboration with Real-Time Editing',
      category: 'Features',
      imageUrl: 'https://home.edweb.net/wp-content/uploads/20230306_technology-event.png?height=200&width=400'
    },
    {
      date: 'Dec 1, 2024',
      title: 'Tiptap Performance Optimization Techniques',
      category: 'Development',
      imageUrl: 'https://runtech.co/wp-content/uploads/Zoom_-_Education_-_6-scaled.jpg?height=200&width=400'
    }
  ]

  return (
    <section className="flex flex-col items-center justify-center px-4 py-20  space-y-24  rounded-t-3xl relative">
      <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7x font-light leading-tight">Latest Blog Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
        {blogPosts.map((post, index) => (
          <BlogCard key={index} {...post} />
        ))}
      </div>
      <Link
        href="/blog"
          target="_blank"
          rel="noopener noreferrer">
        <CustomButton
          className=" text-white hover:bg-gray-300 transition-colors"
        >
          Read More on Our Blog
        </CustomButton>
      </Link>
    </section>
  )
}

export default BlogSection

