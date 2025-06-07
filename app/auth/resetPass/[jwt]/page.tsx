import { ResetPasswordForm } from "@/components/authentication/reset-password-form";
import { verifyJwt } from "@/lib/jwt";


export default async function page({
  params
}: {
  params:  Promise<{ jwt: string }>
}) {

  const jwt = (await params).jwt;

  const payload = verifyJwt(jwt);
  if (!payload)
    return (
      <div className="flex items-center justify-center h-screen text-red-500 text-2xl">
        The URL is not valid!
      </div>
    );
  return (
    <div className="flex justify-center">
      <ResetPasswordForm jwtUserId={jwt} />
    </div>
  );
};

