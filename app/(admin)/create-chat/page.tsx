import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function page() {
  return (
    <div className="flex flex-col items-center justify-center md:flex-row md:space-x-10 bg-white p-10 rounded-md m-10">
      <Avatar />
      <div>
        <h2 className="font-semibold">Create a new chat to help you in your interaction with customers</h2>
        <form className="flex flex-col md:flex-row gap-2 mt-5">
          <Input
            type="text"
            placeholder="Chat name"
            className="max-w-lg"
            required
          />
          <Button>Create Chat</Button>
        </form>
      </div>
    </div>
  )
}
