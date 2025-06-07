"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Camera, Pencil, Save } from 'lucide-react'
import { updateChannel } from '@/app/actions/actions'
import { createChannel, updateChannelImage } from '@/app/actions/channel'
import { getUserChannel } from '@/app/actions/channel'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { uploadFileTos3 } from '@/lib/aws'
import { useRouter } from 'next/navigation'
import { CustomButton } from '../ui/CustomButton'

interface Channel {
  id: string
  name: string
  thumbnail?:string
  description?: string | null
  isActive: boolean
}

export default function ChannelForm() {

  const [loading, setLoading] = useState(true)
  const [channel, setChannel] = useState<Channel | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdating,setIsUpdating] = useState(false)
  const [editedChannel, setEditedChannel] = useState<Partial<Channel>>({})
  const [isCreating, setIsCreating] = useState(false)
  const [thumbnail, setThumbnail] = useState<string>()
  const [newChannel, setNewChannel] = useState({
    name: '',
    description: ''
  })

   const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchChannel() {
      try {
        const userChannel = await getUserChannel()
        setChannel(userChannel)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching channel:', error)
        setLoading(false)
      }
    }

    fetchChannel()
  }, [])

  const handleEdit = () => {
    setEditedChannel({
      name: channel?.name || '',
      description: channel?.description || ''
    })
    setIsEditing(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedChannel(prev => ({ ...prev, [name]: value }))
  }

  const handleNewChannelInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewChannel(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    if (!channel) return
    
    try {
      const updatedChannel = await updateChannel(channel.id, editedChannel)
      setChannel(updatedChannel)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating channel:', error)
    }
  }

  const handleActivationToggle = async (checked: boolean) => {
    if (!channel) return
    
    try {
      const updatedChannel = await updateChannel(channel.id, { isActive: checked })
      setChannel(updatedChannel)
    } catch (error) {
      console.error('Error updating channel activation:', error)
    }
  }

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const formData = new FormData()
      formData.append('name', newChannel.name)
      formData.append('description', newChannel.description)
      
      const createdChannel = await createChannel(newChannel.name, newChannel.description, null)
      setChannel(createdChannel)
      setIsCreating(false)
    } catch (error) {
      console.error('Error creating channel:', error)
    }
  }

   const handleProfileImageUpdate = async (file: File) => {
        try {
          setIsUpdating(true);
    
          const data = await uploadFileTos3(file);
          router.refresh();
        
          if(data){
            const image = await updateChannelImage(channel.id, data.url as string);
            setThumbnail(image as string)
          }
          
        } catch (error) {
          console.error("Failed to upload image:", error);
          throw error;
        } finally {
            setIsUpdating(false);
          }
      };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (!channel && !isCreating) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl overflow-hidden mb-6 shadow border-none">
          <CardHeader className="bg-gray-50 p-4">
            <CardTitle className="text-sm font-bold text-indigo-800">
              Create Your Channel
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 bg-white">
            <div className="space-y-4">
              <p className="text-gray-600">
                You dont have a channel yet. Create one to start sharing your content!
              </p>
              <Button 
                onClick={() => setIsCreating(true)} 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
              >
                Register New Channel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isCreating) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl overflow-hidden mb-6 shadow border-none">
          <CardHeader className="bg-gray-50 p-4">
            <CardTitle className="text-sm font-bold text-indigo-800">
              Register New Channel
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 bg-white">
            <form onSubmit={handleCreateChannel} className="space-y-4">
              <div>
                <Label htmlFor="new-channel-name" className="text-xs text-indigo-700">
                  Channel Name
                </Label>
                <Input
                  id="new-channel-name"
                  name="name"
                  value={newChannel.name}
                  onChange={handleNewChannelInputChange}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="new-channel-description" className="text-xs text-indigo-700">
                  Channel Description
                </Label>
                <Textarea
                  id="new-channel-description"
                  name="description"
                  value={newChannel.description}
                  onChange={handleNewChannelInputChange}
                  className="mt-1"
                  rows={4}
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                >
                  Create Channel
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="bg-transparent rounded-xl overflow-hidden mb-6">
        <CardHeader className="bg-gray-50 p-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-bold text-indigo-800">
              {isEditing ? 'Edit Channel' : 'Channel Details'}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Label htmlFor="channel-activation" className="text-xs text-indigo-700">
                {channel?.isActive ? 'Active' : 'Inactive'}
              </Label>
              <Switch
                id="channel-activation"
                checked={channel?.isActive || false}
                onCheckedChange={handleActivationToggle}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 bg-white">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="channel-name" className="text-xs text-indigo-700">
                  Channel Name
                </Label>
                <Input
                  id="channel-name"
                  name="name"
                  value={editedChannel.name || ''}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="channel-description" className="text-xs text-indigo-700">
                  Channel Description
                </Label>
                <Textarea
                  id="channel-description"
                  name="description"
                  value={editedChannel.description || ''}
                  onChange={handleInputChange}
                  className="mt-1"
                  rows={4}
                />
              </div>
              <Button onClick={handleSave} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-indigo-700">Channel Name</h3>
                <p className="text-gray-600">{channel?.name}</p>
              </div>
              <div>
                <h3 className="text-sm text-indigo-700">Channel Description</h3>
                {channel?.description ? (
                  <p className="text-gray-600">{channel.description}</p>
                ) : (
                  <p className="text-gray-400 italic">No description provided. Click Edit Channel to add one!</p>
                )}
              </div>
              <Button onClick={handleEdit} className="bg-green-500 rounded-3xl text-white hover:from-indigo-500 hover:to-purple-500">
                <Pencil className="w-4 h-4 mr-2" />
                Edit Channel
              </Button>
              <Card className="bg-gradient-to-br from-green-400 to-green-600">
                <CardHeader>
                  <CardTitle className="flex items-center text-white font-normal gap-2">
                    <Camera className="w-5 h-5" />
                    Channel Picture
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="w-32 h-32">
                      <AvatarImage className="object-cover" src={thumbnail ?? channel.thumbnail as string} />
                      <AvatarFallback>CS</AvatarFallback>
                    </Avatar>

                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            await handleProfileImageUpdate(file);
                        
                          } catch (error) {
                            console.error("Upload failed:", error);
                          }
                        }
                      }}
                    />

                    <div className="space-y-2">
                      <CustomButton
                      disabled={isUpdating}
                        className="w-full flex items-center justify-center text-white"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Upload New Photo
                      </CustomButton>
                    </div>

                    <p className="text-xs text-white text-center">
                      JPG, PNG or GIF. Max size 5MB.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}