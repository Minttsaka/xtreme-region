import { activateUser } from "@/app/actions/auth";
import Link from "next/link";


export default async function page({
  params
}: {
  params:  Promise<{ jwt: string }>
}) {

  const jwt = (await params).jwt;

const result = await activateUser(jwt)

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className=" w-full space-y-6  dark:bg-gray-900">
        <div className="space-y-2 text-center text-xs">
         
          <div className="text-gray-500 dark:text-gray-400">
          
              {result.data === "userNotExist" ? (
            <p className="text-red-500 text-2xl">Your account does not exist, please sign up first!</p>
          ) : result.data === "alreadyActivated" ? (
            <div>
               <MailIcon className="mx-auto h-12 w-12 text-[green]" />
              <p className="text-[green] text-2xl">You are already activated.<a className="text-[blue]" href="/signin">login</a></p>
            </div>
            
          ) : result.data !== "alreadyActivated" && result.data !== "userNotExist" ? <div>Welcome, <Link href={'/signin'}>signin</Link></div>
          :(<p>Something went wrong</p>)
          }
          </div>
        </div>
      </div>
    </div>
  );
};


function MailIcon(props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}
