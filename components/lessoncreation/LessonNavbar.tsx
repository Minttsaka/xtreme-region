"use client"

import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,

} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Book,
  FileText,
  Save,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  File,
  Plus,
  Languages,
  Star,
  Download,
  Send,
  CheckCircle,
  MoreVertical,
  Menu,
} from "lucide-react"
import { Prisma, User } from "@prisma/client"
import { Slide } from "@/types/lesson-editor"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"

type Resource = Prisma.LessonToResourceGetPayload<{
  include:{
    resource:{
      include:{
        authors:true
      }
    }
  }
}>

export function LessonNavbar({ 
  resources ,
  setPdfFile,
  isSaving,
  courseName,
  subjectName,
  lastSaved,
  lessonName,
  handlePublishSlides,
  slides,
  user,
  onSaveSlides,
}:{ 
  resources: Resource[],
  isSaving:boolean,
  user:User,
  courseName:string,
  lessonName:string,
  subjectName:string | undefined,
  lastSaved:Date | null ,
  handlePublishSlides: (slides: Slide[]) => Promise<void>
  setPdfFile:Dispatch<SetStateAction<string | null>>
  slides: Slide[]
  onSaveSlides: (slides: Slide[]) => Promise<void>
 }) {
  const [isResourceOpen, setIsResourceOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState<Resource>()
  const [searchQuery, setSearchQuery] = useState("")
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const filteredResources = resources.filter(
    (resource) =>
      resource.resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.resource.authors.lastName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleResourceView = () => setIsResourceOpen(!isResourceOpen)

  const handleResourceSelect = (resource: Resource) => {
    setPdfFile(resource.resource.fileUrl)
    setSelectedResource(resource)
    // In a real application, this would trigger the PDF viewer to load the selected resource
  }

  const scrollResources = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (scrollContainerRef.current) {
        const isOverflowing = scrollContainerRef.current.scrollWidth > scrollContainerRef.current.clientWidth
        setIsOverflowing(isOverflowing)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [filteredResources])

  const [isOverflowing, setIsOverflowing] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target) {
        setPdfFile(e.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const [isPublishing, setIsPublishing] = useState(false)

  const handlePublish = async () => {
    setIsPublishing(true)
    // Simulate publish process

    try {
      handlePublishSlides(slides)
    } catch (error) {
      console.error(error)
      
    } finally {
      setIsPublishing(false)
    }
    // Handle actual publish logic here
  }

  return (
     <nav className="bg-white text-gray-800 p-4 shadow-lg">
       <div className="w-full bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header Row */}
        <div className="flex items-center justify-between py-4">
          {/* Left Section - Title and Badges */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <h1 className="text-lg sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 truncate">
                {lessonName}
              </h1>

              {/* Badges - Hidden on mobile, shown on tablet+ */}
              <div className="hidden sm:flex items-center gap-2">
                {courseName && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 text-xs">
                    {courseName}
                  </Badge>
                )}
                {subjectName && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200 text-xs">
                    {subjectName}
                  </Badge>
                )}
              </div>
            </div>

            {/* Mobile Badges Row */}
            <div className="flex sm:hidden items-center gap-2 mt-2">
              {courseName && (
                <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 text-xs">
                  {courseName}
                </Badge>
              )}
              {subjectName && (
                <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200 text-xs">
                  {subjectName}
                </Badge>
              )}
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2 ml-4">
            {/* Major Publish Button - Always Visible */}
            <Button
              onClick={handlePublish}
              disabled={isPublishing}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base"
            >
              {isPublishing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Publishing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Publish</span>
                  <span className="sm:hidden">Publish</span>
                </>
              )}
            </Button>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Save Status */}
              {isSaving ? (
                <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-amber-500 border-t-transparent" />
                  <span className="text-sm text-amber-600">Saving...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSaveSlides(slides)}
                    className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  {lastSaved && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded border border-green-200">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-600">
                        Saved {lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <Button variant="ghost" onClick={triggerFileInput} className="text-gray-600 hover:text-gray-800">
                <File className="h-4 w-4 mr-2" />
                Upload PDF
              </Button>

              <Avatar className="h-8 w-8">
                <AvatarImage className="object-cover" src={user.image as string} alt={user.name as string} />
                <AvatarFallback>US</AvatarFallback>
              </Avatar>
            </div>

            {/* Tablet Actions */}
            <div className="hidden md:flex lg:hidden items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-600">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => onSaveSlides(slides)}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={triggerFileInput}>
                    <File className="h-4 w-4 mr-2" />
                    Upload PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Avatar className="h-8 w-8">
                <AvatarImage className="object-cover" src={user.image as string} alt={user.name as string} />
                <AvatarFallback>US</AvatarFallback>
              </Avatar>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-600">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col gap-4 mt-6">
                    {/* User Profile */}
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                      <Avatar className="h-8 w-8">
                        <AvatarImage className="object-cover" src={user.image as string} alt={user.name as string} />
                        <AvatarFallback>US</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.career}</p>
                      </div>
                    </div>

                    {/* Save Status */}
                    <div className="space-y-3">
                      {isSaving ? (
                        <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-amber-500 border-t-transparent" />
                          <span className="text-sm text-amber-600">Saving changes...</span>
                        </div>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => onSaveSlides(slides)}
                            className="w-full justify-start"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </Button>
                          {lastSaved && (
                            <div className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-green-600">
                                Last saved: {lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <Button variant="outline" onClick={triggerFileInput} className="w-full justify-start">
                        <File className="h-4 w-4 mr-2" />
                        Upload PDF
                      </Button>                    
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Secondary Row - Resources and Status */}
        <div className="flex items-center justify-between py-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            {resources.length > 0 && (
              <Button
                variant={isResourceOpen ? "secondary" : "ghost"}
                onClick={toggleResourceView}
                size="sm"
                className={`transition-all duration-300 ease-in-out ${
                  isResourceOpen ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                {isResourceOpen ? <X className="h-4 w-4 mr-2" /> : <Book className="h-4 w-4 mr-2" />}
                <span className="hidden sm:inline">Resources</span>
                <span className="sm:hidden">Files</span>
                <Badge variant="secondary" className="ml-2 text-xs">
                  {resources.length}
                </Badge>
              </Button>
            )}

            <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
              Draft
            </Badge>
          </div>

          {/* Mobile Save Status */}
          <div className="md:hidden">
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-amber-500 border-t-transparent" />
                <span className="text-xs text-amber-600">Saving...</span>
              </div>
            ) : lastSaved ? (
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600">
                  {lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          onChange={onFileChange}
          style={{ display: "none" }}
        />
      </div>
    </div>

      <AnimatePresence>
        {isResourceOpen && resources.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 bg-gray-100 rounded-lg p-4 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Resources</h2>
              <div className="relative w-64">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search resources..."
                  className="pl-8 bg-white border-gray-200 text-gray-800 focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="relative">
              {isOverflowing && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md rounded-full"
                    onClick={() => scrollResources("left")}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md rounded-full"
                    onClick={() => scrollResources("right")}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}
              <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
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
                      className={`group relative overflow-hidden border-none bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all cursor-pointer ${
                        resource.id === selectedResource?.id ? "ring-2 ring-purple-600" : ""
                      }`}
                      onClick={() => handleResourceSelect(resource)}
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
                            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{resource.resource.title}</h3>

                            {/* Authors: resource.authors is a single Author object, not an array */}
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">
                                  {resource.resource.authors.firstName} {resource.resource.authors.lastName}
                                </span>
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
                                <span>
                                  {resource.resource.edition ? `Edition: ${resource.resource.edition}` : "No Edition"}
                                </span>
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
              </div>
            </div>
          </motion.div>
        )}
        <p className="md:hidden my-2 text-[red]">Use PC if you want to edit the lesson</p>
      </AnimatePresence>
    </nav>
  )
}

