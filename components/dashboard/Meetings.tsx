import React from 'react'
import MeetingsCard from './MeetingsCard'

const Meetings: React.FC = () => {
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
    <section className="flex flex-col items-center justify-center space-y-24 bg-gray-100 rounded-t-3xl relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 w-full">
        {blogPosts.map((post, index) => (
          <MeetingsCard key={index} {...post} />
        ))}
      </div>
    </section>
  )
}

export default Meetings

