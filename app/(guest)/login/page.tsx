import Avatar from "@/components/Avatar";
import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="flex h-[100vh] py-10 md:py-0 flex-col flex-1 justify-center items-center bg-[#2239c9]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col items-center justify-center space-y-5 text-white">
          <div className="rounded-full bg-white p-5"><Avatar /></div>
          <div className="text-center">
            <h1 className="text-4xl">Biz-assistant</h1>
            <h2 className="text-base font-light">I am your ultimate business tool</h2>
            <h3 className="my-5 font-bold">Sign in to get started</h3>
          </div>
        </div>
        <SignIn routing="hash" fallbackRedirectUrl='/' />
      </div>
    </div>
  )
}
