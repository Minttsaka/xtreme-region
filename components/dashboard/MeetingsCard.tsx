import React from 'react'

interface MeetingsCardProps {
  date: string
  title: string
  category: string
  imageUrl: string
}

const MeetingsCard: React.FC<MeetingsCardProps> = ({ title, category, imageUrl }) => {
  return (
    <div className="relative flex flex-col flex-1 bg-white rounded-md shadow overflow-hidden">
      {/* Top-left gradient */}
      <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-pink-500 to-transparent opacity-20 rounded-tl-lg"></div>
      
      {/* Top-right gradient */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-500 to-transparent opacity-20 rounded-tr-lg"></div>
      
      <div className="p-6 space-y-2 flex-grow">
        <div className="flex flex-col space-y-2">
          <div className="text-sm text-gray-500 underline">Explore</div>
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        </div>
        <div className="flex">
          <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-200 rounded-full">
            {category}
          </span>
        </div>
      </div>
      <div className="relative w-full h-48">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          // layout="fill"
          // objectFit="cover"
          className='object-cover w-full'
        />
      </div>
      
      {/* Bottom-left gradient */}
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-green-500 to-transparent opacity-20 rounded-bl-lg"></div>
      
      {/* Bottom-right gradient */}
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-yellow-500 to-transparent opacity-20 rounded-br-lg"></div>
    </div>
  )
}

export default MeetingsCard

