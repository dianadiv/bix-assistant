import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="p-10 bg-white m-10 rounded-md w-full">
      <h1 className="text-4xl font-light">Welcome to Biz-assistant</h1>
      <h2 className="mt-2 mb-10">Your customisable AI chat agent that helps you manage your customer conversation</h2>
      <Link href='/create-chat'>
        <Button className="bg-[#2239c9]">
          Lets get started by creating first chatbot
        </Button>
      </Link>
    </main>
  );
}
