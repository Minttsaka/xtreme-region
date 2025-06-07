import type React from "react"
import FeatureCard from "./FeatureCard"

const features = [
  {
    title: "Interactive Live Classes",
    description: "Engage in real-time with instructors and peers through our advanced video conferencing platform.",
    category: "Learning",
    imageUrl: "https://img.freepik.com/free-vector/features-overview-concept-illustration_114360-1481.jpg?height=300&width=400",
  },
  {
    title: "Personalized Learning Paths",
    description: "Tailored course recommendations based on your goals, skills, and learning style.",
    category: "AI-Powered",
    imageUrl: "https://img.freepik.com/free-vector/features-overview-concept-illustration_114360-1481.jpg?height=300&width=400",
  },
  {
    title: "Collaborative Projects",
    description: "Work on group assignments and projects with real-time collaboration tools.",
    category: "Teamwork",
    imageUrl: "https://img.freepik.com/free-vector/features-overview-concept-illustration_114360-1481.jpg?height=300&width=400",
  },
  

]

const ExploreFeatures: React.FC = () => {
  return (
    <div className="py-12 px-4">
      <h2 className="text-lg mb-12">Explore Our Educational Platform Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            category={feature.category}
            imageUrl={feature.imageUrl}
          />
        ))}
      </div>
    </div>
  )
}

export default ExploreFeatures

