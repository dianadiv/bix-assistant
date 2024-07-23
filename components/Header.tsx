import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Avatar from "./Avatar";

export default function Header() {
  return (
    <header className="bg-white text-black flex justify-between p-5">
      <Link href='/' className="flex gap-5 items-center">
        <Avatar />
        <div className="space-y-1">
          <h1>Biz-assistant</h1>
          <h2 className="text-sm">I am your ultimate business tool</h2>
        </div>
      </Link>
      <div className='flex items-center'>
        <SignedIn>
          <UserButton showName />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </header>
  )
}
