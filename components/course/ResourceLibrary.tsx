'use client'

import { useState, Dispatch, SetStateAction } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Download, Star,FileText, Languages, Plus, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { ResourceCategory } from '@/types/resource'
import { Prisma } from '@prisma/client'


type Resource = Prisma.ResourceToSubjectGetPayload<{
  include:{
    subject:true,
    resource:{
      include:{
        authors:true,
      }
    }
  }
 
}>

type SelectedResource = Prisma.ResourceGetPayload<{
    include:{
      authors:true,
    }
}>

export default function ResourceLibrary({
  selectedResources,
  setSelectedResources,
  resources
}:{
  selectedResources:Set<SelectedResource>,
  setSelectedResources:Dispatch<SetStateAction<Set<SelectedResource>>>
  resources:Resource[]
}) {

  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<ResourceCategory | 'all'>('all')
  const [sortBy, setSortBy] = useState<'rating' | 'newest' | 'popular'>('rating')

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.resource.authors.firstName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || resource.subject.name === categoryFilter
    return matchesSearch && matchesCategory
  })

  const toggleResourceSelection = (resourc: SelectedResource) => {
    const newSelection = new Set(selectedResources)
    if (newSelection.has(resourc)) {
      newSelection.delete(resourc)
    } else {
      newSelection.add(resourc)
    }
    setSelectedResources(newSelection)
  }

  return (
      <div className="container mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white shadow border-none"
              />
            </div>
            <Select value={categoryFilter} onValueChange={(value: ResourceCategory | 'all') => setCategoryFilter(value)}>
              <SelectTrigger className="bg-white/80 backdrop-blur-sm bg-white shadow border-none">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="textbook">Textbooks</SelectItem>
                <SelectItem value="workbook">Workbooks</SelectItem>
                <SelectItem value="guide">Guides</SelectItem>
                <SelectItem value="reference">Reference</SelectItem>
                <SelectItem value="literature">Literature</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value: typeof sortBy) => setSortBy(value)}>
              <SelectTrigger className="bg-white/80 backdrop-blur-sm bg-white shadow border-none">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Selected Resources Summary */}
          {selectedResources.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-purple-50 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 rounded-full p-2">
                  <Check className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-purple-900">
                    {selectedResources.size} resources selected
                  </p>
                  <p className="text-sm text-purple-600">
                    Click on resources to select/deselect
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Resources Grid */}
          <div className="grid grid-cols-1  gap-1">
            <AnimatePresence>
              {filteredResources.map((resource) => (
                <motion.div
                  key={resource.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                 <Card
                  className={`group relative overflow-hidden border-none bg-white shadow hover:bg-white/90 transition-all cursor-pointer ${
                    selectedResources.has(resource.resource) ? 'ring-2 ring-purple-600' : ''
                  }`}
                  onClick={() => toggleResourceSelection(resource.resource)}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <div className="relative w-32 h-44 flex-shrink-0">
                        <img
                          src={resource.resource.thumbnail || "/placeholder.svg"}
                          alt={resource.resource.title}
                          className="w-full h-full object-cover rounded-lg shadow-lg"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Plus className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                          {resource.resource.title}
                        </h3>

                        {/* Authors: resource.authors is a single Author object, not an array */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-2">
                          
                            <span className="text-sm text-gray-600">{resource.resource.authors.firstName} {resource.resource.authors.lastName}</span>
                          </div>
                        </div>

                        {/* Other fields */}
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            <span>{resource.resource.pages ? `${resource.resource.pages} pages` : "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Languages className="w-4 h-4" />
                            <span>{resource.resource.publicationPlace || "Unknown Place"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span>{resource.resource.edition ? `Edition: ${resource.resource.edition}` : "No Edition"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            <span>{resource.resource.fileUrl ? "Download Available" : "No File"}</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  </CardContent>
                </Card>

                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Preview Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="hidden">Preview</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Resource Preview</DialogTitle>
                <DialogDescription>
                  Detailed view of the selected resource
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <img
                    src="/placeholder.svg"
                    alt="Resource preview"
                    className="w-full rounded-lg"
                  />
                </div>
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Resource Title</h2>
                  <p className="text-gray-600">
                    Detailed description of the resource...
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
  )
}

