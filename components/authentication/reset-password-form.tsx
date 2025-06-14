/**
* This code was generated by v0 by Vercel.
* @see https://v0.dev/t/1L0NV1ScA8I
* Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
*/

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
"use client";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { resetPassword } from "@/app/actions/auth";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  jwtUserId: string;
}

const FormSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters!")
      .max(52, "Password must be less than 52 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match!",
    path: ["confirmPassword"],
  });

type InputType = z.infer<typeof FormSchema>;

export function ResetPasswordForm({ jwtUserId }: Props) {

  const router=useRouter()
  const [visiblePass, setVisiblePass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });

  const resetPass: SubmitHandler<InputType> = async (data) => {
    try {
      const result = await resetPassword(jwtUserId, data.password);
      if (result === "success")
        toast.success("Your password has been reset successfully!");
        router.push('/signin')
    } catch (err) {
      toast.error("Something went wrong!");
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center h-screen w-full">
      <div className="">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Reset Password</h1>
        <p className="text-gray-500 dark:text-gray-400">Enter your email and a new password to reset your account.</p>
      </div>
      <form onSubmit={handleSubmit(resetPass)} className="space-y-4 bg-white rounded shadow p-3">
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <Input {...register("password")} type={visiblePass ? "text" : "password"} id="password" required />
          <Label htmlFor="confirm">Confirm Password</Label>
          <Input
            type={visiblePass ? "text" : "password"}
            {...register("confirmPassword")}
            id="confirm"
          />
          <button type="button" onClick={() => setVisiblePass((prev) => !prev)}>
            {visiblePass ? (
              <EyeOffIcon className="w-4" />
            ) : (
              <EyeIcon className="w-4" />
            )}
          </button>
        </div>
        <Button  className="w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Please Wait..." : "Submit"}
        </Button>
      </form>
      </div>
    </div>
  )
}
