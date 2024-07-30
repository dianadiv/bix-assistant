import Header from "@/components/Header"
import SideBar from "@/components/SideBar";

export default function AdminLayout({children}: Readonly<{children: React.ReactNode}>) {
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