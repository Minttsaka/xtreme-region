"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { AgendaItemType } from "./AgendaItem"
import { generateAgendaId } from "./AgendaCreator"
import { Clock, Users, CheckCircle, ArrowRight, Briefcase, Coffee, Brain, Target } from "lucide-react"

interface TemplateType {
  id: string
  title: string
  description: string
  duration: number
  icon: React.ReactNode
  items: AgendaItemType[]
}

interface AgendaTemplatesProps {
  onSelectTemplate: (template: TemplateType) => void
}

export function AgendaTemplates({ onSelectTemplate }: AgendaTemplatesProps) {
  const templates: TemplateType[] = [
    {
      id: "team-standup",
      title: "Daily Team Standup",
      description: "Quick daily sync to discuss progress and blockers",
      duration: 15,
      icon: <Users className="h-5 w-5 text-blue-500" />,
      items: [
        {
          id: generateAgendaId(),
          title: "Welcome & Announcements",
          duration: 2,
          description: "Quick welcome and any team announcements",
          presenter: "Team Lead",
          status: "pending",
          priority: "medium",
          notes: "",
          
        },
        {
          id: generateAgendaId(),
          title: "Yesterday's Progress",
          duration: 5,
          description: "Each team member shares what they accomplished yesterday",
          presenter: "All Team Members",
          status: "pending",
          priority: "high",
          notes: "",
          
        },
        {
          id: generateAgendaId(),
          title: "Today's Plan",
          duration: 5,
          description: "Each team member shares what they plan to work on today",
          presenter: "All Team Members",
          status: "pending",
          priority: "high",
          notes: "",
          
        },
        {
          id: generateAgendaId(),
          title: "Blockers & Support Needed",
          duration: 3,
          description: "Discuss any blockers or support needed",
          presenter: "All Team Members",
          status: "pending",
          priority: "medium",
          notes: "",
          
        },
      ],
    },
    {
      id: "sprint-planning",
      title: "Sprint Planning",
      description: "Plan the upcoming sprint and assign tasks",
      duration: 60,
      icon: <Target className="h-5 w-5 text-purple-500" />,
      items: [
        {
          id: generateAgendaId(),
          title: "Sprint Review",
          duration: 10,
          description: "Review of the previous sprint's accomplishments",
          presenter: "Scrum Master",
          status: "pending",
          priority: "medium",
          notes: "",
          
        },
        {
          id: generateAgendaId(),
          title: "Backlog Refinement",
          duration: 15,
          description: "Review and refine the product backlog",
          presenter: "Product Owner",
          status: "pending",
          priority: "high",
          notes: "",
          
        },
        {
          id: generateAgendaId(),
          title: "Sprint Goal Definition",
          duration: 10,
          description: "Define the goal for the upcoming sprint",
          presenter: "Product Owner & Team",
          status: "pending",
          priority: "high",
          notes: "",
          
        },
        {
          id: generateAgendaId(),
          title: "Capacity Planning",
          duration: 5,
          description: "Determine team capacity for the sprint",
          presenter: "Scrum Master",
          status: "pending",
          priority: "medium",
          notes: "",
          
        },
        {
          id: generateAgendaId(),
          title: "Task Breakdown & Estimation",
          duration: 15,
          description: "Break down stories into tasks and estimate",
          presenter: "Development Team",
          status: "pending",
          priority: "high",
          notes: "",
          
        },
        {
          id: generateAgendaId(),
          title: "Sprint Commitment",
          duration: 5,
          description: "Team commits to the sprint backlog",
          presenter: "All",
          status: "pending",
          priority: "medium",
          notes: "",
          
        },
      ],
    },
    {
      id: "brainstorming",
      title: "Brainstorming Session",
      description: "Creative session to generate ideas and solutions",
      duration: 45,
      icon: <Brain className="h-5 w-5 text-amber-500" />,
      items: [
        {
          id: generateAgendaId(),
          title: "Problem Statement",
          duration: 5,
          description: "Define the problem or challenge to be addressed",
          presenter: "Session Lead",
          status: "pending",
          priority: "high",
          notes: "",
          
        },
        {
          id: generateAgendaId(),
          title: "Warm-up Exercise",
          duration: 5,
          description: "Quick creative thinking exercise to get started",
          presenter: "Facilitator",
          status: "pending",
          priority: "low",
          notes: "",
          
        },
        {
          id: generateAgendaId(),
          title: "Idea Generation",
          duration: 15,
          description: "Open brainstorming session for all ideas",
          presenter: "All Participants",
          status: "pending",
          priority: "high",
          notes: "",
          
        },
        {
          id: generateAgendaId(),
          title: "Idea Grouping",
          duration: 5,
          description: "Organize and categorize the generated ideas",
          presenter: "Facilitator",
          status: "pending",
          priority: "medium",
          notes: "",
          
        },
        {
          id: generateAgendaId(),
          title: "Idea Evaluation",
          duration: 10,
          description: "Evaluate and prioritize the most promising ideas",
          presenter: "All Participants",
          status: "pending",
          priority: "high",
          notes: "",
          
        },
        {
          id: generateAgendaId(),
          title: "Next Steps",
          duration: 5,
          description: "Define action items and responsibilities",
          presenter: "Session Lead",
          status: "pending",
          priority: "medium",
          notes: "",
          
        },
      ],
    },
    {
      id: "client-meeting",
      title: "Client Meeting",
      description: "Professional meeting with clients or stakeholders",
      duration: 60,
      icon: <Briefcase className="h-5 w-5 text-green-500" />,
      items: [
        {
          id: generateAgendaId(),
          title: "Welcome & Introductions",
          duration: 5,
          description: "Welcome clients and introduce team members",
          presenter: "Account Manager",
          status: "pending",
          priority: "medium",
          notes: "",
          
        },
        {
          id: generateAgendaId(),
          title: "Project Status Update",
          duration: 15,
          description: "Overview of current project status and milestones",
          presenter: "Project Manager",
          status: "pending",
          priority: "high",
          notes: "",
          
        },
        {
          id: generateAgendaId(),
          title: "Deliverables Review",
          duration: 15,
          description: "Review of recent deliverables and feedback",
          presenter: "Team Lead",
          status: "pending",
          priority: "high",
          notes: "",
          
        },
        {
          id: generateAgendaId(),
          title: "Discussion of Challenges",
          duration: 10,
          description: "Address any challenges or concerns",
          presenter: "Project Manager",
          status: "pending",
          priority: "medium",
          notes: "",
          
        },
        {
          id: generateAgendaId(),
          title: "Next Steps & Timeline",
          duration: 10,
          description: "Outline upcoming milestones and deliverables",
          presenter: "Account Manager",
          status: "pending",
          priority: "high",
          notes: "",
          
        },
        {
          id: generateAgendaId(),
          title: "Q&A",
          duration: 5,
          description: "Open floor for questions and answers",
          presenter: "All",
          status: "pending",
          priority: "medium",
          notes: "",
          
        },
      ],
    },
    {
      id: "one-on-one",
      title: "One-on-One Meeting",
      description: "Individual check-in with team members",
      duration: 30,
      icon: <Coffee className="h-5 w-5 text-red-500" />,
      items: [
        {
          id: generateAgendaId(),
          title: "Personal Check-in",
          duration: 5,
          description: "How are you doing? General well-being check",
          presenter: "Manager",
          status: "pending",
          priority: "medium",
          notes: "",
          
        },
        {
          id: generateAgendaId(),
          title: "Progress Review",
          duration: 10,
          description: "Review of recent work and accomplishments",
          presenter: "Team Member",
          status: "pending",
          priority: "high",
          notes: "",
          
        },
        {
          id: generateAgendaId(),
          title: "Challenges & Support",
          duration: 5,
          description: "Discuss any challenges and support needed",
          presenter: "Team Member",
          status: "pending",
          priority: "high",
          notes: "",
          
        },
        {
          id: generateAgendaId(),
          title: "Goals & Development",
          duration: 5,
          description: "Discuss career goals and development opportunities",
          presenter: "Both",
          status: "pending",
          priority: "medium",
          notes: "",
          
        },
        {
          id: generateAgendaId(),
          title: "Feedback Exchange",
          duration: 5,
          description: "Two-way feedback session",
          presenter: "Both",
          status: "pending",
          priority: "medium",
          notes: "",
          
        },
      ],
    },
  ]

  return (
    <div className="p-4">
      <h3 className="font-medium text-gray-700 mb-4">Select a Template</h3>
      <ScrollArea className="h-[calc(100vh-250px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <Card
              key={template.id}
              className="border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer"
              onClick={() => onSelectTemplate(template)}
            >
              <CardContent className="p-4">
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                    {template.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{template.title}</h4>
                    <p className="text-sm text-gray-500 mt-0.5">{template.description}</p>
                    <div className="flex items-center mt-2 space-x-2">
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {template.duration} min
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {template.items.length} items
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
