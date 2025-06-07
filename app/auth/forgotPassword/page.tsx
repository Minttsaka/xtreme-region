"use client";
import { forgotPassword } from "@/app/actions/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { z } from "zod";

const FormSchema = z.object({
  email: z.string().email("Please enter a valid email!"),
});

type InputType = z.infer<typeof FormSchema>;

const ForgotPasswordPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<InputType>({
    resolver: zodResolver(FormSchema),
  });

  const submitRequest: SubmitHandler<InputType> = async (data) => {
    try {
      const result = await forgotPassword(data.email);
      if (result) toast.success("Reset password link was sent to your email.");
      reset();
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong!");
    }
  };
  return (

      <div className="relative text-black b-gray-100 min-h-screen flex items-center p-5 justify-center ">
      <form
        className=""
        onSubmit={handleSubmit(submitRequest)}
      >
        <div className="text-center p-2">
          <h2 className="text-2xl font-semibold">Enter your Email</h2>
          <p>We will send the link to your email address to reset your password</p>
        </div>
        <Input
          className="w-full bg-gray- border bg-white shadow  "
          id="email"
          {...register("email")} 
          placeholder="tutorempire@godzillaai.tech"
          type="email"
          />
        <Button
          type="submit"
          className="w-full mt-2"
          disabled={isSubmitting}
          color="primary"
        >
          {isSubmitting ? "Please Wait..." : "Submit"}
        </Button>
      </form>
      
    </div>
    
  );
};

export default ForgotPasswordPage;
