"use client"

import { useState, useEffect } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { restrictToVerticalAxis, restrictToWindowEdges } from "@dnd-kit/modifiers"
import { AgendaItem, type AgendaItemType } from "./AgendaItem"
import { SortableAgendaItem } from "./SortableAgendaItem"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AgendaAIAssistant } from "./AgendaAIAssistant"
import { AgendaTemplates } from "./AgendaTemplates"
import { Clock, Plus, Save, Share, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { Prisma, User } from "@prisma/client"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { initializeAgoraRTM, publishMessage } from "@/lib/initAgoraClient"
import { getAgenda } from "@/app/actions/actions"
import { toast } from "sonner"
import { InviteCollaboration } from "./InviteCollaboration"
import { RTMClient } from "agora-rtm-sdk"
import { AgoraMessage, AgoraMessageEvent, CurrentUser, PresenceEvent } from "@/types/agora"

export function generateAgendaId() {
    return Math.random().toString(36).substring(2, 9)
  }


type Meeting = Prisma.MeetingGetPayload<{
  include:{
    collaborators:{
      include:{
        user:true
      }
    }
  }
}>
export function AgendaCreator({
  meeting,
  user
}:{
  meeting:Meeting,
  user:CurrentUser
}) {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [activeUsers, setActiveUsers] = useState<User[]>([])
  const [rtm, setRtm] = useState<RTMClient>()
  const [channelName, setChannelName] = useState<string>("")
  const [agendaItems, setAgendaItems] = useState<AgendaItemType[]>([])
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [totalTime, setTotalTime] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("agenda")
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  // const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "connecting">("disconnected")

  useEffect(()=>{
  
      setupRTM()
      broadcastAgendaItems()
      setLastSaved(new Date)
      
    },[])

    const broadcastAgendaItems = async () => {
    
        try {
    
          const agendaItems = await getAgenda(meeting.id)
          setAgendaItems(agendaItems)
          
        } catch (error) {
    
          console.log(error)
          
        }
    
        }
  
    const setupRTM = async () => {
      try {

        // setConnectionStatus("connecting")
        const { rtm, channelName } = await initializeAgoraRTM(meeting.id, user)
        setChannelName(channelName)
        // if(rtm){
        //   setConnectionStatus("connected")
        // }
        setRtm(rtm)
   
      } catch (error) {
        console.error("Failed to initialize Agora RTM:", error)
      } finally {
       
      }
    }

     useEffect(()=>{
    
        (async()=>{
    
          if(!user) return
          await publishMessage(rtm, channelName, {
            type: "user_join",
            userId: user.id,
            user,
            message: `${user.name} joined.`
          }) 
        })()
        
      },[user])

        // const handlePresence = (event: PresenceEvent) => {
        //   // switch (event.eventType) {
        //   //   case "REMOTE_JOIN":
        //   //     setActiveUsers(prev => [...prev, user])
        //   //     console.log(`from prresence ${event.publisher} joined ${event.channelName}`);
        //   //     break;
        //   //   case "REMOTE_LEAVE":
        //   //     console.log(`${event.publisher} left ${event.channelName}`);
        //   //     break;
        //   //   case "SNAPSHOT":
        //   //     console.log("Current users in channel:", event.snapshot);
        //   //     break;
        //   //   case "REMOTE_STATE_CHANGED":
        //   //     console.log(`${event.publisher} changed state to:`, event.stateChanged);
        //   //     break;
        //   //   default:
        //   //     console.log("Presence event:", event);
        //   // }
        // }

        useEffect(() => {
      if (!rtm) return
  
     const messageReceived = (event: any) => {
  // Message payload
        const messageData = event.message;              
        
        try {
          const message: AgoraMessage = JSON.parse(messageData);

          if (!user) {
            return;
          }

          if (message.type === "agendaItems_move") {
    
            toast(message.message)

          } else if (message.type === "delete_agendaItem") {
           toast(message.message)

          } else if (message.type === "user_join") {
           toast(message.message)
            setActiveUsers(prev => [...prev, message.user]);

          } else if (message.type === "request_agendaItems") {
            // Handle request agenda items
            
          } else if (message.type === "slide_selected" && message.userId !== user.id) {
            // Handle slide selection
            
          }
        } catch (err) {
          console.error("Error processing message:", err);
        }
      };
    
      rtm.addEventListener("message", messageReceived)
    
      return () => {
        if (rtm) {
          rtm.removeEventListener("message", messageReceived)
             }
      }
    }, [rtm,agendaItems])

    useEffect(() => {
    
          (async()=>{
    
            if (agendaItems.length > 0 && onSaveAgendaItems) {
              
              try {
                await onSaveAgendaItems()
      
              } catch (error) {
                console.error("Error saving agendaItems:", error)
                toast("Failed to save agendaItems")
              }
            }
    
          })()
    
        }, [agendaItems])

        async function onSaveAgendaItems() {
          setIsSaving(true)      
          try {
            
            const response = await fetch(`/api/meeting/${meeting.id}`, {
              method:"POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ agendaItems }),
            })
      
            const data = await response.json()
      
            if (!response.ok) {
              throw new Error(data.error || "Failed to save meeting")
            }
 
            toast("Your meeting agenda has been saved successfully.")

          } catch (error) {
            console.error("Error saving meeting:", error)
            toast("An unknown error occurred")
          } finally {
            setIsSaving(false)
          }
        }

  // Calculate total time whenever agenda items change
  useEffect(() => {
    const total = agendaItems.reduce((sum, item) => sum + item.duration, 0)
    setTotalTime(total)
  }, [agendaItems])

  // Setup sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Handle drag start
  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id)
  }

  // Handle drag end
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setAgendaItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }

    setActiveId(null)
  }

  // Add new agenda item
  async function addAgendaItem() {
    const newItem: AgendaItemType = {
      id: generateAgendaId(),
      title: "New Agenda Item",
      duration: 10,
      description: "",
      presenter: "",
      status: "pending",
      priority: "medium",
      notes: "",
      
    }

    setAgendaItems([...agendaItems, newItem])
    await publishMessage(rtm, channelName, {
      type: "request_agendaItems",
      userId: user.id,
      user,
      message: `${user.name} added new slide.`
    }) 
    

  }

  // Update agenda item
  function updateAgendaItem(updatedItem: AgendaItemType) {
    setAgendaItems(agendaItems.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
  }

  // Delete agenda item
  async function deleteAgendaItem(id: string) {
    setAgendaItems(agendaItems.filter((item) => item.id !== id))
    await publishMessage(rtm, channelName, {
      type: "user_join",
      userId: user.id,
      user,
      message: `${user.name} deleted agenda. ${agendaItems.find((item) => item.id !== id)?.title}`
    })
  }

  // Get active item for drag overlay
  const activeItem = activeId ? agendaItems.find((item) => item.id === activeId) : null

  // Time warning calculation
  const timeWarning = totalTime > meeting.duration

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="shadow-md border-0 overflow-hidden">
          <CardHeader className="bg-white border-b border-gray-100 pb-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-800">
                  {meeting.topic}
                </CardTitle>
                <CardDescription>
                  {meeting.description}
                </CardDescription>
                <div className="flex items-center mt-1 text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {meeting.startDate.getDate()} / {meeting.startDate.getMonth()} / {meeting.startDate.getFullYear()}
                  <span className="mx-2">•</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <div className="flex items-center">
                    {meeting.duration}
                    <span className="text-sm text-gray-500">min</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                onClick={() => setIsInviteDialogOpen(true)}
                 variant="outline" size="sm" className="text-gray-600">
                  <Share className="h-4 w-4 mr-1" />
                  Invite Collaboration
                </Button>
                <InviteCollaboration meeting={meeting} isOpen={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen} />
                {isSaving  ? 
                  <div className="px-5 -mt-4">
                    <span className="text-sm text-amber-500">Saving...</span>
                  </div> :
                  <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={()=>onSaveAgendaItems()} className="text-gray-600 hover:text-gray-800 hover:bg-gray-100">
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                      {lastSaved && !isSaving && (
                        <span className="text-sm text-green-500">Saved at {lastSaved.toLocaleTimeString()}</span>
                      )}
                  </div>
                }
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {meeting.collaborators.map((collaborator) => {
                const isCurrentUser = collaborator.user.id === user.id
                const surname = getSurname(collaborator.user.name  as string)

                return (
                  <TooltipProvider key={collaborator.user.id} delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="relative group">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${
                              isCurrentUser ? "border-emerald-400 ring-1 ring-emerald-400" : "border-gray-200"
                            }`}
                          >
                            {collaborator.user.image ? (
                              <img
                                src={collaborator.user.image || "/placeholder.svg"}
                                alt={collaborator.user.name as string}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-[10px] font-medium text-gray-700">{surname.charAt(0)}</span>
                            )}
                          </div>
                            
                          {activeUsers.some(user => user.id === collaborator.userId)
                           && <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full border border-white"></span>}

                          {/* Surname label */}
                          <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[9px] text-gray-600 whitespace-nowrap font-medium">
                            {surname}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-xs py-1 px-2">
                        {collaborator.user.name} {isCurrentUser && "(You)"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              })}
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="bg-gray-100">
                <TabsTrigger value="agenda" className="data-[state=active]:bg-white">
                  Agenda
                </TabsTrigger>
                <TabsTrigger disabled={true} value="templates" className="data-[state=active]:bg-white">
                  Templates
                </TabsTrigger>
              </TabsList>
              <CardContent className="p-0">
            <TabsContent value="agenda" className="m-0">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <h3 className="font-medium text-gray-700">Agenda Items</h3>
                    <div
                      className={cn("ml-3 flex items-center text-sm", timeWarning ? "text-red-500" : "text-green-600")}
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Total: {totalTime} min</span>
                      {timeWarning && (
                        <Badge variant="destructive" className="ml-2 text-xs">
                          Exceeds meeting duration
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button onClick={addAgendaItem} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                </div>

                <ScrollArea className="h-[calc(100vh-350px)] pr-4">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
                  >
                    <SortableContext items={agendaItems.map((item) => item.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-3">
                        {agendaItems.map((item) => (
                          <SortableAgendaItem
                            key={item.id}
                            item={item}
                            onUpdate={updateAgendaItem}
                            onDelete={deleteAgendaItem}
                          />
                        ))}
                      </div>
                    </SortableContext>

                    <DragOverlay>
                      {activeItem ? (
                        <div className="opacity-80">
                          <AgendaItem item={activeItem} onUpdate={updateAgendaItem} onDelete={deleteAgendaItem} />
                        </div>
                      ) : null}
                    </DragOverlay>
                  </DndContext>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="m-0">
              <AgendaTemplates
                onSelectTemplate={(template) => {
                  setAgendaItems(template.items)
                  setActiveTab("agenda")
                }}
              />
            </TabsContent>
          </CardContent>
            </Tabs>
          </CardHeader>

         

          <CardFooter className="bg-gray-50 border-t border-gray-100 py-3">
            <div className="w-full flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {agendaItems.length} items • Last edited {new Date().toLocaleDateString()}
              </div>
              <div className="relative group">
                {/* Animated background glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-500 rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-shift"></div>
                
                {/* Main button */}
                <button
                  className="relative flex items-center px-4 py-2 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 hover:border-white/25 transition-all duration-300 group-hover:translate-y-[-2px] group-hover:shadow-lg group-hover:shadow-cyan-500/50"
                  onClick={() => setIsAIAssistantOpen(!isAIAssistantOpen)}
                >
                  {/* Logo with pulse effect */}
                  <div className="relative mr-3 flex-shrink-0">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 blur-sm animate-pulse"></div>
                    <div className="relative h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center overflow-hidden border border-white/20">
                      <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M20 4L8.5 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M15 4H20V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      
                      {/* Animated particles */}
                      <div className="absolute h-1 w-1 rounded-full bg-blue-400 animate-particle-1"></div>
                      <div className="absolute h-1 w-1 rounded-full bg-purple-400 animate-particle-2"></div>
                    </div>
                  </div>
                  
                  {/* Text content */}
                  <div className="flex flex-col items-start">
                    <div className="flex items-center">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 font-medium">MINT</span>
                      <div className="ml-1.5 px-1.5 py-0.5 rounded-md bg-gradient-to-r from-purple-900/50 to-indigo-900/50 backdrop-blur-sm border border-purple-700/50 flex items-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 mr-1 animate-ping-slow"></div>
                        <span className="text-[10px] font-semibold text-cyan-300 tracking-wider">BETA</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-blue-200/70">Intelligent assistance</span>
                  </div>
                  
                  {/* Animated corner accents */}
                  <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-cyan-500"></div>
                  <div className="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-cyan-500"></div>
                </button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="lg:col-span-1">
        {isAIAssistantOpen ? (
          <AgendaAIAssistant
            agendaItems={agendaItems}
            meetingTitle={meeting.topic}
            meetingDuration={meeting.duration}
            onAddItems={(newItems) => {
              setAgendaItems([...agendaItems, ...newItems])
            }}
            onClose={() => setIsAIAssistantOpen(false)}
          />
        ) : (
          <Card className="shadow-md border-0 h-full">
            <CardHeader className="bg-white border-b border-gray-100">
              <CardTitle className="text-lg font-semibold text-gray-800">Meeting Summary</CardTitle>
              <CardDescription>Overview of your meeting plan</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Time Allocation</h3>
                  <div className="space-y-2">
                    {agendaItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full mr-2",
                              item.priority === "high"
                                ? "bg-red-500"
                                : item.priority === "medium"
                                  ? "bg-blue-500"
                                  : "bg-green-500",
                            )}
                          />
                          <span className="text-sm text-gray-600 truncate max-w-[180px]">{item.title}</span>
                        </div>
                        <span className="text-sm text-gray-500">{item.duration} min</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Total Time</span>
                      <span className={cn("text-sm font-medium", timeWarning ? "text-red-500" : "text-green-600")}>
                        {totalTime} min
                      </span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={cn("h-2.5 rounded-full", timeWarning ? "bg-red-500" : "bg-green-500")}
                        style={{ width: `${Math.min(100, (totalTime / meeting.duration) * 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">0 min</span>
                      <span className="text-xs text-gray-500">{meeting.duration} min</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Presenters</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(agendaItems.map((item) => item.presenter)))
                      .filter(Boolean)
                      .map((presenter) => (
                        <Badge key={presenter} variant="outline" className="bg-gray-50">
                          {presenter}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

const getSurname = (fullName: string) => {
  const nameParts = fullName.split(" ")
  return nameParts.length > 1 ? nameParts[nameParts.length - 1] : fullName
}
