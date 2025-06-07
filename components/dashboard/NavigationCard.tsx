"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Settings, Building2 } from 'lucide-react'
import Link from "next/link"

interface NavigationCardProps {
  title: string
  description?: string
  configureHref: string
  manageHref: string
}

export default function NavigationCard({ 
  title, 
  description, 
  configureHref, 
  manageHref 
}: NavigationCardProps) {
  return (
    <Card className="relative flex flex-col flex-1 overflow-hidden">
      {/* Gradient overlays */}
      <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-pink-500 to-transparent opacity-20 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-500 to-transparent opacity-20 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-green-500 to-transparent opacity-20 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-yellow-500 to-transparent opacity-20 rounded-br-lg" />
      
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground underline">Explore</div>
          <h3 className="text-xl font-semibold">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        <div className="space-y-4">
          <Link href={configureHref} className="w-full">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 hover:bg-secondary"
            >
              <Settings className="h-4 w-4" />
              Configure Channel
            </Button>
          </Link>
          
          <Link href={manageHref} className="w-full">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 hover:bg-secondary"
            >
              <Building2 className="h-4 w-4" />
              Manage Institutions
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}

