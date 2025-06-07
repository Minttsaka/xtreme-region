"use server"

import { prisma } from "@/lib/db";
import { getUser } from "@/lib/user";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs"
import { auth, signOut } from "@/app/authhandlers/auth";

  export type ProfileData = {
  name: string;
  email: string;
  bio: string;
  career: string;
  address: string;
  phone: string;
  currentQualification: string;
};

export async function updateProfile(data: Partial<ProfileData>) {
  "use server";

  const sessionUser = await getUser();

  if (!sessionUser) {
    throw new Error("You must be logged in to update your profile.");
  }

  const name = data.name
  const email = data.email
  const career = data.career
  const address = data.address
  const bio = data.bio
  const phone = data.phone
  const currentQualification = data.currentQualification


  const updatedUser = await prisma.user.update({
    where: { id: sessionUser.id },
    data: {
      name,
      email,
      career,
      address,
      bio,
      phone,
      currentQualification,
    },
  });

  revalidatePath("/profile");

  return updatedUser;
}

export async function updateProfileImage(imageUrl: string) {
  "use server";
    const sessionUser = await getUser();
    if (!sessionUser) {
      throw new Error("You must be logged in to update your profile image.");
    }
    const updatedUser = await prisma.user.update({
      where: { id: sessionUser.id },
      data: {
        image: imageUrl,
      },
    });
    revalidatePath("/profile");
    return updatedUser;
}


export async function changePassword(formData: FormData) {
  try {
    // Get current user session
    const session = await auth()
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized. Please log in again.",
      }
    }

    // Extract form data
    const currentPassword = formData.get("currentPassword") as string
    const newPassword = formData.get("newPassword") as string

    // Validate inputs
    if (!currentPassword || !newPassword) {
      return {
        success: false,
        error: "Current password and new password are required.",
      }
    }

    // Password strength validation
    const passwordRegex = {
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /\d/.test(newPassword),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    }

    const isValidPassword = Object.values(passwordRegex).every(Boolean)
    if (!isValidPassword) {
      return {
        success: false,
        error: "New password does not meet security requirements.",
      }
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, password: true },
    })

    if (!user || !user.password) {
      return {
        success: false,
        error: "User not found or password not set.",
      }
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return {
        success: false,
        error: "Current password dont match.",
        field: "currentPassword",
      }
    }

    // Check if new password is different from current
    const isSamePassword = await bcrypt.compare(newPassword, user.password)
    if (isSamePassword) {
      return {
        success: false,
        error: "New password must be different from current password.",
        field: "newPassword",
      }
    }

    // Hash new password
    const saltRounds = 12
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)

    // Update password in database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedNewPassword,
        updatedAt: new Date(),
      },
    })

    // Revalidate relevant paths
    revalidatePath("/settings")
    revalidatePath("/profile")

    return {
      success: true,
      message: "Password updated successfully. Other sessions have been signed out for security.",
    }
  } catch (error) {
    console.error("Password change error:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    }
  }
}

export async function deleteAccount(formData: FormData) {
  try {
    // Get current user session
    const user = await getUser()


    if (!user || !user.password) {
      return {
        success: false,
        error: "User not found or password not set.",
        field: null,
      }
    }

    const password = formData.get("password") as string
      // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return {
        success: false,
        error: "Password is incorrect.",
        field: "password",
      }
    }

    // Delete account with transaction
    await prisma.user.delete({
      where: { id: user.id },
    })

    await signOut()

    return {
      success: true,
      message: "Account deleted successfully. All your data has been permanently removed.",
      field: null,
    }
  } catch (error) {
    console.error("Account deletion error:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
      field: null,
    }
  }
}

export async function removeProfilePhoto() {
  try {
    // Get the current user session
    const session = await auth()
    
    if (!session?.user?.email) {
      return { success: false, message: "Not authenticated" }
    }
    
    // Update the user record to remove profile photo
    await prisma.user.update({
      where: {
        email: session.user.email
      },
      data: {
        image: null // Set profile image to null
      }
    })
    
    // Revalidate the user's profile page to reflect changes
    revalidatePath('/profile')
    revalidatePath('/dashboard')
    
    return { 
      success: true, 
      message: "Profile photo removed successfully" 
    }
  } catch (error) {
    console.error("Error removing profile photo:", error)
    return { 
      success: false, 
      message: "Failed to remove profile photo" 
    }
  }
}