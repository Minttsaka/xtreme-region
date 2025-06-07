"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {

  FileText,
   DollarSign,
  MessageCircle,
  Download,
  Languages,
  Star,
  Plus,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "../ui/badge"
import ResourceLibrary from "../course/ResourceLibrary"
import { NewLesson } from "@/types/lesson"
import { saveNewLesson } from "@/app/actions/actions"
import { Prisma } from "@prisma/client"
import { CustomButton } from "../ui/CustomButton"


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

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  isPaid: z.boolean().default(false),
  price: z.number().optional().nullable(),
  accessLevel: z.enum(["PUBLIC", "REGISTERED_USERS", "ENROLLED_ONLY"]).default("PUBLIC"),
  allowComments: z.boolean().default(false),
  downloadableResources: z.boolean().default(false),
  duration: z.number().optional().nullable(),
})

export default function ScheduleClass({ courseId, resources }:{ courseId:string, resources:Resource[] }) {
  const [step, setStep] = useState<string>("details")
  const [selectedResources, setSelectedResources] = useState<Set<SelectedResource>>(new Set())

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      isPaid: false,
      price: null,
      accessLevel: "PUBLIC",
      allowComments: false,
      downloadableResources: false,
      duration: null,
    },
  })

  const isPaid = form.watch("isPaid")

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // Only include price if isPaid is true
    const price = data.isPaid ? data.price : null

    const newLesson = {
      ...data,
      price,
      resources: selectedResources,    
      status: "NOT_STARTED",
    }

    const result = await saveNewLesson(newLesson as NewLesson, courseId)

    if (result.success) {

      window.open(`/i/editor/${result.data?.id}`, '_blank');

    } else {
      alert(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 border-none bg-gray-100">
            <CardHeader>
              <CardTitle>Class Configuration</CardTitle>
              <CardDescription>Set up your virtual classroom environment</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs  value={step} onValueChange={(value) => setStep(value)}>
                <TabsList className="grid w-full grid-cols-3 bg-white shadow rounded-full">
                  <TabsTrigger className="shadow-md" value="details">Details</TabsTrigger>
                  <TabsTrigger className="shadow-md" value="resources">Resources</TabsTrigger>
                  {/* <TabsTrigger value="settings">Settings</TabsTrigger> */}
                </TabsList>

                <TabsContent value="details">
                  <Form {...form}>
                    <form className="space-y-6">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Class Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter an engaging title for your class"
                                {...field}
                                className="border-none bg-white shadow"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="What will you cover in this class?"
                                {...field}
                                className="min-h-[150px] border-none bg-white shadow"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="duration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Duration (minutes)</FormLabel>
                              <FormControl>
                              <Input
                                type="number"
                                placeholder="60"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value ? Number.parseInt(e.target.value) : null
                                  )
                                }
                                className="border-none bg-white shadow"
                              />

                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="accessLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Access Level</FormLabel>
                            <Select disabled onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="border-none bg-white shadow">
                                  <SelectValue placeholder="Select access level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="PUBLIC">PUBLIC</SelectItem>
                                <SelectItem value="REGISTERED_USERS">REGISTERED_USERS</SelectItem>
                                <SelectItem value="ENROLLED_ONLY">ENROLLED_ONLY</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="isPaid"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center bg-white shadow justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="flex items-center gap-2">
                                  <DollarSign className="w-5 h-5 text-yellow-500" />
                                  <div>
                                    <p className="font-medium">Paid Lesson</p>
                                    <p className="text-sm text-gray-500">Charge students for this lesson</p>
                                  </div>
                                </FormLabel>
                              </div>
                              <FormControl>
                                <Switch disabled checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        {isPaid && (
                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                                    <Input
                                      type="number"
                                      step="0.01"
                                      placeholder="9.99"
                                      {...field}
                                      value={field.value ?? ''} // this ensures value is never null
                                      onChange={(e) =>
                                        field.onChange(e.target.value ? Number.parseFloat(e.target.value) : undefined)
                                      }
                                      className="pl-10 border-none bg-white shadow"
                                    />

                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        <FormField
                          control={form.control}
                          name="allowComments"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center bg-white shadow justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="flex items-center gap-2">
                                  <MessageCircle className="w-5 h-5 text-blue-500" />
                                  <div>
                                    <p className="font-medium">Allow Comments</p>
                                    <p className="text-sm text-gray-500">Enable student comments on this lesson</p>
                                  </div>
                                </FormLabel>
                              </div>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="downloadableResources"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center bg-white shadow justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="flex items-center gap-2">
                                  <Download className="w-5 h-5 text-green-500" />
                                  <div>
                                    <p className="font-medium">Downloadable Resources</p>
                                    <p className="text-sm text-gray-500">Allow students to download resources</p>
                                  </div>
                                </FormLabel>
                              </div>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="resources">
                  <ResourceLibrary selectedResources={selectedResources} setSelectedResources={setSelectedResources} resources={resources} />
                </TabsContent>

                {/* <TabsContent value="settings">
                  <div className="space-y-6">
                    <div className="grid gap-6">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 backdrop-blur-sm">
                        <Label className="flex items-center gap-2">
                          <Video className="w-5 h-5 text-purple-500" />
                          <div>
                            <p className="font-medium">Enable Video</p>
                            <p className="text-sm text-gray-500">Allow participants to share video</p>
                          </div>
                        </Label>
                        <Switch
                          checked={settings.enableVideo}
                          onCheckedChange={(checked) => setSettings({ ...settings, enableVideo: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 backdrop-blur-sm">
                        <Label className="flex items-center gap-2">
                          <Mic className="w-5 h-5 text-pink-500" />
                          <div>
                            <p className="font-medium">Enable Audio</p>
                            <p className="text-sm text-gray-500">Allow participants to use microphone</p>
                          </div>
                        </Label>
                        <Switch
                          checked={settings.enableAudio}
                          onCheckedChange={(checked) => setSettings({ ...settings, enableAudio: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 backdrop-blur-sm">
                        <Label className="flex items-center gap-2">
                          <MonitorUp className="w-5 h-5 text-blue-500" />
                          <div>
                            <p className="font-medium">Screen Sharing</p>
                            <p className="text-sm text-gray-500">Allow screen sharing during class</p>
                          </div>
                        </Label>
                        <Switch
                          checked={settings.allowScreenShare}
                          onCheckedChange={(checked) => setSettings({ ...settings, allowScreenShare: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg bg-white/50 backdrop-blur-sm">
                        <Label className="flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-green-500" />
                          <div>
                            <p className="font-medium">Chat Features</p>
                            <p className="text-sm text-gray-500">Enable chat during class</p>
                          </div>
                        </Label>
                        <Switch
                          checked={settings.enableChat}
                          onCheckedChange={(checked) => setSettings({ ...settings, enableChat: checked })}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent> */}
              </Tabs>
            </CardContent>
          </Card>

          <Card className="border-none backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Class configuration summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label className="text-sm text-gray-500">Title</Label>
                  <p className="font-medium mt-1">{form.watch("title") || "Not set"}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Access</Label>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={
                        form.watch("accessLevel") === "PUBLIC"
                          ? "bg-green-100 text-green-700"
                          : form.watch("accessLevel") === "REGISTERED_USERS"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }
                    >
                      {form.watch("accessLevel")}
                    </Badge>
                    {form.watch("isPaid") && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                        ${form.watch("price") || "0.00"}
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-gray-500">Features</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {form.watch("allowComments") && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        Comments
                      </Badge>
                    )}
                    {form.watch("downloadableResources") && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Downloads
                      </Badge>
                    )}
                    {form.watch("duration") && (
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                        {form.watch("duration")} min
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-gray-500">Resources</Label>
                  <div className="mt-2 space-y-2">
                    {selectedResources.size === 0 ? (
                      <p className="text-sm text-gray-400">No resources added yet</p>
                    ) : (
                      <AnimatePresence>
                        {Array.from(selectedResources).map((resource) => (
                          <motion.div
                            key={resource.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Card
                              className="group relative overflow-hidden border-none bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all cursor-pointer "
                            >
                              <CardContent className="p-6">
                                <div className="flex gap-6">
                                  <div className="relative w-32 h-44 flex-shrink-0">
                                    <img
                                      src={resource.thumbnail || "/placeholder.svg"}
                                      alt={resource.title}
                                      className="w-full h-full object-cover rounded-lg shadow-lg"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                      <Plus className="w-8 h-8 text-white" />
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                                      {resource.title}
                                    </h3>
          
                                    {/* Authors */}
                                    <div className="flex flex-wrap gap-2 mb-3">
          
                                        <span  className="text-sm text-gray-600">
                                          {resource.authors.firstName} {resource.authors.lastName}
                                        </span>
                                    
                                    </div>
          
                                    {/* Other fields */}
                                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                                      <div className="flex items-center gap-1">
                                        <FileText className="w-4 h-4" />
                                        <span>{resource.pages ? `${resource.pages} pages` : "N/A"}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Languages className="w-4 h-4" />
                                        <span>{resource.publicationPlace || "Unknown Place"}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <span>{resource.edition ? `Edition: ${resource.edition}` : "No Edition"}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Download className="w-4 h-4" />
                                        <span>{resource.fileUrl ? "Download Available" : "No File"}</span>
                                      </div>
                                    </div>
          
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center gap-4">
          <CustomButton
            variant="outline"
            onClick={() => {
              if (step === "resources") setStep("details")
              if (step === "settings") setStep("resources")
            }}
            className="w-32"
          >
            Back
          </CustomButton>
          <CustomButton
            onClick={() => {
              if (step === "details") setStep("resources")
              if (step === "resources") form.handleSubmit(onSubmit)()
            }}
            className="w-32 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
          >
            {step === "resources" ? "Create Class" : "Next"}
          </CustomButton>
        </div>
      </motion.div>
    </div>
  )
}
