"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { AgendaItemType } from "./AgendaItem"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Sparkles, X, Plus, RefreshCw, Clock,} from "lucide-react"

interface AgendaAIAssistantProps {
  agendaItems: AgendaItemType[]
  meetingTitle: string
  meetingDuration: number
  onAddItems: (items: AgendaItemType[]) => void
  onClose: () => void
}

export function AgendaAIAssistant({
  agendaItems,
  meetingTitle,
  meetingDuration,
  onAddItems,
  onClose,
}: AgendaAIAssistantProps) {
  const [prompt, setPrompt] = useState("")
  const [suggestedItems, setSuggestedItems] = useState<AgendaItemType[]>([])
  const [activeTab, setActiveTab] = useState("suggest")
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Mock AI generation - in a real app, this would call an AI API
  const generateAgendaItems = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt to generate agenda items")
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-agenda", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          meetingTitle,
          meetingDuration,
          existingItems: agendaItems,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate agenda items")
      }

      const data = await response.json()

      setSuggestedItems(data.items)
    } catch (err) {
      console.error("Error generating agenda items:", err)
      setError("Failed to generate agenda items. Please try again with a different prompt.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAddAllItems = () => {
    onAddItems(suggestedItems)
    setSuggestedItems([])
    setPrompt("")
  }

  const handleAddItem = (item: AgendaItemType) => {
    onAddItems([item])
    setSuggestedItems(suggestedItems.filter((i) => i.id !== item.id))
  }


  return (
    <Card className="shadow-md border-0 h-full">
      <CardHeader className="bg-white border-b border-gray-100 pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
              <Bot className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-800">AI Assistant</CardTitle>
              <CardDescription>Get help with your meeting agenda</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="suggest" className="data-[state=active]:bg-white">
              <Sparkles className="h-4 w-4 mr-1" />
              Suggest Items
            </TabsTrigger>
            {/* <TabsTrigger value="optimize" className="data-[state=active]:bg-white">
              <RefreshCw className="h-4 w-4 mr-1" />
              Optimize Agenda
            </TabsTrigger> */}
          </TabsList>
          <CardContent className="p-4">
        <TabsContent value="suggest" className="m-0 p-0">
        {error && <div className="p-3 bg-red-50 text-red-800 rounded-md text-sm">{error}</div>}
          <div className="space-y-4">
            <div>
              <label htmlFor="prompt" className="text-sm font-medium text-gray-700 mb-1 block">
                What kind of agenda items do you need?
              </label>
              <Textarea
                id="prompt"
                placeholder="E.g., 'Suggest agenda items for a product launch planning meeting' or 'Add items for team retrospective'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={generateAgendaItems}
                disabled={!prompt.trim() || isGenerating}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Suggestions
                  </>
                )}
              </Button>
            </div>

            {suggestedItems.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium text-gray-700">Suggested Items</h3>
                  <Button variant="outline" size="sm" onClick={handleAddAllItems} className="text-xs h-7">
                    <Plus className="h-3 w-3 mr-1" />
                    Add All
                  </Button>
                </div>

                <ScrollArea className="h-[calc(100vh-450px)]">
                  <div className="space-y-3">
                    {suggestedItems.map((item) => (
                      <Card key={item.id} className="border border-gray-200 shadow-sm">
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-800">{item.title}</h4>
                              <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
                              <div className="flex items-center mt-2 space-x-2">
                                <Badge variant="outline" className="text-xs bg-gray-50">
                                  {item.presenter}
                                </Badge>
                                <div className="flex items-center text-xs text-gray-500">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {item.duration} min
                                </div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleAddItem(item)}
                              className="h-7 w-7 p-0 rounded-full"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </TabsContent>
      </CardContent>
        </Tabs>
      </CardHeader>

      

      <CardFooter className="bg-gray-50 border-t border-gray-100 py-3">
        <div className="w-full flex justify-between items-center">
          <div className="text-xs text-gray-500">AI suggestions are based on meeting context and best practices</div>
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Beta Feature</Badge>
        </div>
      </CardFooter>
    </Card>
  )
}
