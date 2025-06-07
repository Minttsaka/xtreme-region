
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enjoy the lesson",
  description: "Wishing you all the best!",
  icons:'https://dct4life-files.s3.af-south-1.amazonaws.com/uploads/icon.png'
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
