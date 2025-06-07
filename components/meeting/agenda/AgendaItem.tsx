"use client"

import type React from "react"

import { HTMLAttributes, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, GripVertical, MoreHorizontal, Edit, Trash2, } from "lucide-react"
import { cn } from "@/lib/utils"

export interface AgendaItemType {
  id: string
  title: string
  duration: number
  description: string | null
  presenter: string | null
  status: "pending" | "progress" | "completed" | "skipped"
  priority: "low" | "medium" | "high"
  notes: string | null
}

interface AgendaItemProps {
  item: AgendaItemType
  onUpdate: (item: AgendaItemType) => void
  onDelete: (id: string) => void
  dragHandleProps?: HTMLAttributes<HTMLElement>
}

export function AgendaItem({ item, onUpdate, onDelete, dragHandleProps }: AgendaItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedItem, setEditedItem] = useState<AgendaItemType>(item)
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedItem({ ...editedItem, [name]: value })
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedItem({ ...editedItem, [name]: Number.parseInt(value) || 0 })
  }

  const handleSelectChange = (name: string, value: string) => {
    setEditedItem({ ...editedItem, [name]: value })
  }

  const saveChanges = () => {
    onUpdate(editedItem)
    setIsEditing(false)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50"
      case "medium":
        return "text-blue-600 bg-blue-50"
      case "low":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50"
      case "progress":
        return "text-amber-600 bg-amber-50"
      case "skipped":
        return "text-gray-600 bg-gray-50"
      default:
        return "text-blue-600 bg-blue-50"
    }
  }

  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex items-start p-3">
          <div {...dragHandleProps} className="mt-1 mr-2 cursor-grab text-gray-400 hover:text-gray-600">
            <GripVertical className="h-5 w-5" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-800 truncate">{item.title}</h3>
                {item.description && <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{item.description}</p>}
              </div>

              <div className="flex items-center ml-4">
                <div className="flex items-center mr-3">
                  <Clock className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-sm text-gray-600">{item.duration} min</span>
                </div>

                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DialogTrigger asChild>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Item
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DropdownMenuItem onClick={() => onDelete(item.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Item
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Edit Agenda Item</DialogTitle>
                      <DialogDescription>Make changes to your agenda item here.</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="title" className="text-right text-sm font-medium">
                          Title
                        </label>
                        <Input
                          id="title"
                          name="title"
                          value={editedItem.title}
                          onChange={handleInputChange}
                          className="col-span-3"
                        />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="duration" className="text-right text-sm font-medium">
                          Duration (min)
                        </label>
                        <Input
                          id="duration"
                          name="duration"
                          type="number"
                          value={editedItem.duration}
                          onChange={handleNumberChange}
                          className="col-span-3"
                        />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="presenter" className="text-right text-sm font-medium">
                          Presenter
                        </label>
                        <Input
                          id="presenter"
                          name="presenter"
                          value={editedItem.presenter as string}
                          onChange={handleInputChange}
                          className="col-span-3"
                        />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="priority" className="text-right text-sm font-medium">
                          Priority
                        </label>
                        <Select
                          value={editedItem.priority}
                          onValueChange={(value) => handleSelectChange("priority", value)}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="status" className="text-right text-sm font-medium">
                          Status
                        </label>
                        <Select
                          value={editedItem.status}
                          onValueChange={(value) => handleSelectChange("status", value)}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="skipped">Skipped</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-4 items-start gap-4">
                        <label htmlFor="description" className="text-right text-sm font-medium">
                          Description
                        </label>
                        <Textarea
                          id="description"
                          name="description"
                          value={editedItem.description as string}
                          onChange={handleInputChange}
                          className="col-span-3"
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-4 items-start gap-4">
                        <label htmlFor="notes" className="text-right text-sm font-medium">
                          Notes
                        </label>
                        <Textarea
                          id="notes"
                          name="notes"
                          value={editedItem.notes as string}
                          onChange={handleInputChange}
                          className="col-span-3"
                          rows={3}
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={saveChanges}>Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="flex flex-wrap items-center mt-2 gap-2">
              {item.presenter && (
                <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700">
                  {item.presenter}
                </Badge>
              )}

              <Badge className={cn("text-xs", getPriorityColor(item.priority))}>
                {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority
              </Badge>

              <Badge className={cn("text-xs", getStatusColor(item.status))}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace("-", " ")}
              </Badge>
              {item.notes && (
                <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700">
                  Has Notes
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
