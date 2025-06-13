
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enjoy the lesson",
  description: "Wishing you all the best!",
  icons:'/fusion.png'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <div className="flex">
        <div className="w-full overflow-y-auto h-screen">
            {children}  
        </div>   
    </div>
  );
}
