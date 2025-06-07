"use client"

import { useRef, useState } from "react"
import {

  User,
  Lock,

  Trash2,
  Eye,
  EyeOff,
  Camera,

  Smartphone,
  CheckCircle,
  Loader2,
  AlertCircle,

} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { CustomButton } from "../ui/CustomButton"
import { Prisma } from "@prisma/client"
import { changePassword, deleteAccount, removeProfilePhoto, updateProfile, updateProfileImage } from "@/app/actions/profile"
import { uploadFileTos3 } from "@/lib/aws"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

  export type ProfileData = {
  name: string;
  email: string;
  bio: string;
  career: string;
  address: string;
  phone: string;
  currentQualification: string;
};

type User = Prisma.UserGetPayload<{
   include: {
      staff: {
        include: {
          school: true
        }
      },
      completeArena: true,
      _count: {
        select: {
          channels: true,
          meetings: true,
        }
      }
    }
  }>


export function UserSettings({user}:{user: User}) {
  const [activeTab, setActiveTab] = useState("profile")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [profileData, setProfileData] = useState<Partial<ProfileData>>({});
  const [isUpdating, setIsUpdating] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    general: "",
  })
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  })
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false)


const [deleteForm, setDeleteForm] = useState({
  password: "",
  confirmationText: "",
  reason: "",
})

const [isDeleting, setIsDeleting] = useState(false)

const [deleteErrors, setDeleteErrors] = useState({
  password: "",
  confirmationText: "",
  general: "",
})

  const router = useRouter()

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileUpdate = async () => {
    try {
      setIsUpdating(true);
      await updateProfile(profileData)
      router.refresh();
    } catch (error) {
      console.error(error);
      
    } finally {
      setIsUpdating(false);
    }
  };

  const handleProfileImageUpdate = async (file: File) => {
  try {
    setIsUpdating(true);

    const data = await uploadFileTos3(file);

    router.refresh();
  
    if(data){
      await updateProfileImage(data.url as string);
    }
    
  } catch (error) {
    console.error("Failed to upload image:", error);
    throw error;
  } finally {
      setIsUpdating(false);
    }
};

const validatePassword = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }
    setPasswordRequirements(requirements)
    return Object.values(requirements).every(Boolean)
  }

  // Handle password input changes
  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }))
    setPasswordErrors((prev) => ({ ...prev, [field]: "", general: "" }))
    setPasswordUpdateSuccess(false)

    if (field === "newPassword") {
      validatePassword(value)
    }

    if (field === "confirmPassword" && passwordForm.newPassword) {
      if (value !== passwordForm.newPassword) {
        setPasswordErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }))
      }
    }
  }

  // Validate form before submission
  const validatePasswordForm = () => {
    const errors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      general: "",
    }

    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Current password is required"
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required"
    } else if (!validatePassword(passwordForm.newPassword)) {
      errors.newPassword = "Password does not meet requirements"
    }

    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password"
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      errors.newPassword = "New password must be different from current password"
    }

    setPasswordErrors(errors)
    return !Object.values(errors).some((error) => error !== "")
  }

// Updated handlePasswordUpdate function
const handlePasswordUpdate = async () => {
  if (!validatePasswordForm()) return

  setIsUpdatingPassword(true)
  setPasswordErrors((prev) => ({ ...prev, general: "" }))

  try {
    // Create FormData for server action
    const formData = new FormData()
    formData.append("currentPassword", passwordForm.currentPassword)
    formData.append("newPassword", passwordForm.newPassword)

    // Call server action
    const result = await changePassword(formData)

    if (!result.success) {
      // Handle specific field errors
      if (result.field === "currentPassword") {
        setPasswordErrors((prev) => ({
          ...prev,
          currentPassword: result.error,
        }))
      } else if (result.field === "newPassword") {
        setPasswordErrors((prev) => ({
          ...prev,
          newPassword: result.error,
        }))
      } else {
        setPasswordErrors((prev) => ({
          ...prev,
          general: result.error as string,
        }))
      }
      return
    }

    // Success
    setPasswordUpdateSuccess(true)
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
    setPasswordRequirements({
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    })

    // Hide success message after 5 seconds
    setTimeout(() => setPasswordUpdateSuccess(false), 5000)
  } catch (error) {
    console.error(error)
    setPasswordErrors((prev) => ({
      ...prev,
      general: "An unexpected error occurred. Please try again.",
    }))
  } finally {
    setIsUpdatingPassword(false)
  }
}

const handleDeleteAccount = async () => {
  // Validate form
  const errors = {
    password: "",
    confirmationText: "",
    general: "",
  }

  if (!deleteForm.password) {
    errors.password = "Password is required"
  }

  if (deleteForm.confirmationText !== "DELETE") {
    errors.confirmationText = "You must type 'DELETE' to confirm"
  }

  if (errors.password || errors.confirmationText) {
    setDeleteErrors(errors)
    return
  }

  // Show final confirmation
  const finalConfirm = window.confirm(
    "This action cannot be undone. Are you absolutely sure you want to permanently delete your account and all associated data?"
  )

  if (!finalConfirm) return

  setIsDeleting(true)
  setDeleteErrors({ password: "", confirmationText: "", general: "" })

  try {
    const formData = new FormData()
    formData.append("password", deleteForm.password)
    formData.append("confirmationText", deleteForm.confirmationText)
    formData.append("reason", deleteForm.reason)

    const result = await deleteAccount(formData)

    if (!result.success) {
      if (result.field === "password") {
        setDeleteErrors({
          password: result.error,
          confirmationText: "",
          general: "",
        })
      } else if (result.field === "confirmationText") {
        setDeleteErrors({
          password: "",
          confirmationText: result.error,
          general: "",
        })
      } else {
        setDeleteErrors({
          password: "",
          confirmationText: "",
          general: result.error as string,
        })
      }
      return
    }

    // Success - user will be redirected by server action
    alert(result.message)
  } catch (error) {
    console.error(error)
    setDeleteErrors({
      password: "",
      confirmationText: "",
      general: "An unexpected error occurred. Please try again.",
    })
  } finally {
    setIsDeleting(false)
  }
}

  async function handleRemovePhoto() {

    try {
      const result = await removeProfilePhoto()
      
      if (result.success) {
        toast(result.message)
      } else {
        toast(result.message)
      }
    } catch (error) {
      toast("An error occurred while removing your profile photo")
    } 
  }

  return (
     <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-4">
    
          <div>
            <h1 className="md:text-2xl text-gray-900">Account Settings</h1>
            <p className="text-gray-600 text-xs">Manage your profile, security, and preferences</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className=" w-full  rounded-full bg-blue-100">
            <TabsTrigger value="profile" className="flex items-center gap-2 rounded-full">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2 rounded-full">
              <Lock className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2 rounded-full">
              <Trash2 className="w-4 h-4" />
              Account
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Picture */}

              <Card className="bg-gradient-to-br from-green-400 to-green-600">
                <CardHeader>
                  <CardTitle className="flex items-center text-white font-normal gap-2">
                    <Camera className="w-5 h-5" />
                    Profile Picture
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="w-32 h-32">
                      <AvatarImage className="object-cover" src={user.image as string} />
                      <AvatarFallback>US</AvatarFallback>
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

                      <CustomButton
                        variant="ghost"
                        onClick={handleRemovePhoto}
                        className="w-full text-white hover:text-red-500"
                      >
                        Remove Photo
                      </CustomButton>
                    </div>

                    <p className="text-xs text-white text-center">
                      JPG, PNG or GIF. Max size 5MB.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex font-light items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        className="bg-gray-100"
                        id="name"
                        defaultValue={user.name as string}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        className="bg-gray-100"
                        id="email"
                        type="email"
                        disabled
                        defaultValue={user.email as string}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="career">Career Title</Label>
                      <Input
                        className="bg-gray-100"
                        id="career"
                        defaultValue={user.career as string}
                        onChange={(e) => setProfileData({ ...profileData, career: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        className="bg-gray-100"
                        id="address"
                        placeholder="e.g. 123 Main St, City, Country"
                        defaultValue={user.address as string}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        className="bg-gray-100"
                        id="phone"
                        placeholder="e.g. +1 234 567 8900"
                        defaultValue={user.phone as string}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="current-qualification">Current Qualification</Label>
                      <Input
                        className="bg-gray-100"
                        id="current-qualification"
                        placeholder="e.g. Bachelor's in Computer Science"
                        defaultValue={user.currentQualification as string}
                        onChange={(e) => setProfileData({ ...profileData, currentQualification: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      rows={4}
                      className="bg-gray-100"
                      defaultValue={user.bio as string}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  <CustomButton disabled={isUpdating} onClick={handleProfileUpdate} className="w-full md:w-auto">
                    Save Changes
                  </CustomButton>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Change Password */}
                <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Change Password
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {passwordUpdateSuccess && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        Password updated successfully! You may need to sign in again on other devices.
                      </AlertDescription>
                    </Alert>
                  )}

                  {passwordErrors.general && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{passwordErrors.general}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Enter current password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                        className={passwordErrors.currentPassword ? "border-red-500" : ""}
                        disabled={isUpdatingPassword}
                      />
                      <CustomButton
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 hover:text-white top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        disabled={isUpdatingPassword}
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </CustomButton>
                    </div>
                    {passwordErrors.currentPassword && (
                      <p className="text-sm text-red-600">{passwordErrors.currentPassword}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={passwordForm.newPassword}
                        onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                        className={passwordErrors.newPassword ? "border-red-500" : ""}
                        disabled={isUpdatingPassword}
                      />
                      <CustomButton
                       
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 hover:text-white top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        disabled={isUpdatingPassword}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </CustomButton>
                    </div>
                    {passwordErrors.newPassword && <p className="text-sm text-red-600">{passwordErrors.newPassword}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                        className={passwordErrors.confirmPassword ? "border-red-500" : ""}
                        disabled={isUpdatingPassword}
                      />
                      <CustomButton
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 hover:text-white top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isUpdatingPassword}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </CustomButton>
                    </div>
                    {passwordErrors.confirmPassword && (
                      <p className="text-sm text-red-600">{passwordErrors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Password requirements:</p>
                    <ul className="text-xs space-y-1">
                      <li
                        className={`flex items-center gap-2 ${passwordRequirements.length ? "text-green-600" : "text-gray-500"}`}
                      >
                        {passwordRequirements.length ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <div className="w-3 h-3 rounded-full border border-gray-300" />
                        )}
                        At least 8 characters long
                      </li>
                      <li
                        className={`flex items-center gap-2 ${passwordRequirements.uppercase ? "text-green-600" : "text-gray-500"}`}
                      >
                        {passwordRequirements.uppercase ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <div className="w-3 h-3 rounded-full border border-gray-300" />
                        )}
                        Contains uppercase letters (A-Z)
                      </li>
                      <li
                        className={`flex items-center gap-2 ${passwordRequirements.lowercase ? "text-green-600" : "text-gray-500"}`}
                      >
                        {passwordRequirements.lowercase ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <div className="w-3 h-3 rounded-full border border-gray-300" />
                        )}
                        Contains lowercase letters (a-z)
                      </li>
                      <li
                        className={`flex items-center gap-2 ${passwordRequirements.number ? "text-green-600" : "text-gray-500"}`}
                      >
                        {passwordRequirements.number ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <div className="w-3 h-3 rounded-full border border-gray-300" />
                        )}
                        Contains at least one number (0-9)
                      </li>
                      <li
                        className={`flex items-center gap-2 ${passwordRequirements.special ? "text-green-600" : "text-gray-500"}`}
                      >
                        {passwordRequirements.special ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <div className="w-3 h-3 rounded-full border border-gray-300" />
                        )}
                        Contains special characters (!@#$%^&*)
                      </li>
                    </ul>
                  </div>

                  <CustomButton
                    className="w-full"
                    onClick={handlePasswordUpdate}
                    disabled={
                      isUpdatingPassword ||
                      !Object.values(passwordRequirements).every(Boolean) ||
                      passwordForm.newPassword !== passwordForm.confirmPassword
                    }
                  >
                    {isUpdatingPassword ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </CustomButton>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    Push Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Enable Push Notifications</p>
                      <p className="text-sm text-gray-600">Receive notifications on your devices</p>
                    </div>
                    <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                  </div>
                  {pushNotifications && (
                    <>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Urgent Messages</p>
                          <p className="text-sm text-gray-600">Important messages from administration</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Class Reminders</p>
                          <p className="text-sm text-gray-600">Reminders 15 minutes before classes</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Meeting Invites</p>
                          <p className="text-sm text-gray-600">Notifications for meeting invitations</p>
                        </div>
                        <Switch />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle className="flex text-sm font-normal items-center gap-2 text-red-600">
                  <Trash2 className="w-5 h-5" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent>

               <div className="p-4 border border-red-300 rounded-lg bg-red-100">
                <h3 className="font-medium text-red-900 mb-2">Delete Account</h3>
                <p className="text-sm text-red-800 mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>

                {deleteErrors.general && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{deleteErrors.general}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="deletePassword">Confirm Password</Label>
                    <Input
                      id="deletePassword"
                      type="password"
                      placeholder="Enter your password"
                      value={deleteForm.password}
                      onChange={(e) => setDeleteForm({...deleteForm, password: e.target.value})}
                      className={deleteErrors.password ? "border-red-500" : "border-red-300"}
                      disabled={isDeleting}
                    />
                    {deleteErrors.password && (
                      <p className="text-sm text-red-600">{deleteErrors.password}</p>
                    )}
                  </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deleteConfirmation">Type DELETE to confirm account deletion</Label>
                    <Input
                      id="deleteConfirmation"
                      placeholder="Type DELETE here"
                      value={deleteForm.confirmationText}
                      onChange={(e) => setDeleteForm({...deleteForm, confirmationText: e.target.value})}
                      className={deleteErrors.confirmationText ? "border-red-500" : "border-red-300"}
                      disabled={isDeleting}
                    />
                    {deleteErrors.confirmationText && (
                      <p className="text-sm text-red-600">{deleteErrors.confirmationText}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deleteReason">Reason (Optional)</Label>
                    <Textarea
                      id="deleteReason"
                      placeholder="Tell us why you're deleting your account"
                      value={deleteForm.reason}
                      onChange={(e) => setDeleteForm({...deleteForm, reason: e.target.value})}
                      disabled={isDeleting}
                    />
                  </div>

                  <div className="space-y-2 mt-5">
                    <CustomButton
                      className="w-full"
                      onClick={handleDeleteAccount}
                      disabled={isDeleting || deleteForm.confirmationText !== "DELETE"}
                    >
                      {isDeleting ? (
                        <>
                          Deleting Account...
                        </>
                      ) : (
                        <>
                          Delete Account Permanently
                        </>
                      )}
                    </CustomButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  )
}
