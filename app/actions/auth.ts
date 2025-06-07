'use server';

import { signIn, signOut } from '../authhandlers/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { compileActivationTemplate, compileResetPassTemplate, sendMail } from '@/lib/mail';
import { signJwt,verifyJwt } from '@/lib/jwt';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function quickSignUp(data: ({
  username:string,
  email:string,
  password:string,
})): Promise<{ success: boolean; message: string, userId:string | null}> {
  // Validate input using Zod
  try {
    const existingUser = await prisma.user.findUnique({
      where:{
        email:data.email
      }
    })

    if (existingUser) {

      return { success: false, message: 'User with this email already exists', userId:null };
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.user.create({
      data:{
        email:data.email,
        password:passwordHash,
        name:data.username
      }
    })

       const jwtUserId = signJwt({
      id: newUser.id,
    });

    const activationUrl = `${process.env.NEXT_PUBLIC_AUTH_URL!}/auth/activation/${jwtUserId}`;
    const body = compileActivationTemplate(newUser.name as string, activationUrl);
    await sendMail({ to: newUser.email as string, subject: "Activate Your Account", body });

    return { success: true, message: 'User signed up successfully', userId:newUser.id };
  } catch (error) {
    console.log(error)
    console.error('Error during signup:', error);
    return { success: false, message: 'Something went wrong, please try again later',userId:null};
  }
}

export const loginWithGoogle = async () => {
  await signIn("google")
};

export const logout = async () => {
  //await deleteSession()
  await signOut({ redirectTo: "/i/dashboard" });
};


export const activateUser = async (jwtUserID: string) => {
  const payload = verifyJwt(jwtUserID);
  const userId = payload?.id;

  const user = await prisma.user.findUnique({
    where:{
      id:userId
    }
    
  });

  if (!user) return {status:"failed",data:"userNotExist"};;
  if (user.emailVerified) return {status:"failed",data:"alreadyActivated"};;

  const result = await prisma.user.update({
    where:{
      id:userId
    },
    data:{
      emailVerified: new Date(),
    }
    
  });
  // Check if the update was successful, or add any additional conditions as needed
  if (result) {
    return { status:"success",data:user.name};
  } else {
    // Handle the case where the update did not return a value
    return {status:"failed",data:"failed"};; // or any other appropriate value
  }
};

export async function forgotPassword(email: string) {

  const user = await prisma.user.findFirst({
    where:{
      email
    }
    
  });

  if (!user) throw new Error("The User Does Not Exist!");

  //  Send Email with Password Reset Link
  const jwtUserId = signJwt({
    id: user.id,
  });
  const resetPassUrl = `${process.env.NEXTAUTH_URL}/auth/resetPass/${jwtUserId}`;
  const body = compileResetPassTemplate(user.name as string, resetPassUrl);
  const sendResult = await sendMail({
    to: user.email as string,
    subject: "Reset Password",
    body: body,
  });
  return sendResult;
}

type ResetPasswordFucn = (
  jwtUserId: string,
  password: string
) => Promise<"userNotExist" | "success">;

export const resetPassword: ResetPasswordFucn = async (jwtUserId, password) => {
  const payload = verifyJwt(jwtUserId);
  if (!payload) return "userNotExist";
  const userId = payload.id;

  const user = await prisma.user.findUnique({
    where:{
      id:userId
    }, 
  });

  if (!user) return "userNotExist";

  const result = await prisma.user.update(
    {
      where:{
        id:userId
    },
      data:{
        password: await bcrypt.hash(password, 10),
      }
  }
     
  );

  if (result) return "success";
  else throw new Error("Something went wrong!");
};
