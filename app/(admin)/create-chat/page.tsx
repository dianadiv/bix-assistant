'use client';

import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CREATE_CHATBOT } from "@/graphql/mutations/mutations";
import { useMutation } from "@apollo/client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function CreateChatbot() {
  const {user} = useUser();
  const [name, setName] = useState('');
  const router = useRouter();

  const [createChatbot, { data, loading, error }] = useMutation(CREATE_CHATBOT, {
    variables: { clerk_user_id: user?.id, name },
  })

  const handleSumbit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await createChatbot();
      setName('');
      const chatId = data.data.insertChatbots?.id;
      chatId && router.push(`/edit-chat/${data.data.insertChatbots.id}`);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center md:flex-row md:space-x-10 bg-white p-10 rounded-md m-10">
      <Avatar />
      <div>
        <h2 className="font-semibold">Create a new chat to help you in your interaction with customers</h2>
        <form onSubmit={handleSumbit} className="flex flex-col md:flex-row gap-2 mt-5">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Chat name"
            className="max-w-lg"
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating Chat...' : 'Create Chat'}
          </Button>
        </form>

        <p className="text-gray-300 mt-5">Example: Customer Support Chatbot</p>
      </div>
    </div>
  )
}
