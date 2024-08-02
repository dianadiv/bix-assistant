import Header from "@/components/Header"
import SideBar from "@/components/SideBar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({children}: Readonly<{children: React.ReactNode}>) {
  const {userId} = await auth();
  !userId && redirect('/login');
  
  return (
    <div className="flex flex-col flex-1">
      <Header />
      <div className="flex flex-col flex-1 lg:flex-row bg-gray-100">
        <SideBar />
        <div className="min-h-screen flex flex-1 justify-center items-start max-w-5xl mx-auto w-full">
          {children}
        </div>
      </div>
    </div>
  );
}