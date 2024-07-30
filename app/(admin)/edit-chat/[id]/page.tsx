'use client';

import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import Characteristic from "@/components/ui/Characteristic";
import { Input } from "@/components/ui/input";
import { BASE_URL } from "@/graphql/apolloClient";
import { ADD_CHARACTERISTIC, DELETE_CHATBOT, UPDATE_CHATBOT } from "@/graphql/mutations/mutations";
import { GET_CHATBOT_BY_ID } from "@/graphql/queries/queries";
import { GetChatbotByIdeResponse } from "@/types/types";
import { useMutation, useQuery } from "@apollo/client";
import { Copy, LoaderPinwheel } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditChat({ params: { id } }: { params: { id: string } }) {
  const [url, setUrl] = useState('');
  const [chatBotName, setChatBotName] = useState('');
  const [newChars, setNewChars] = useState('');
  const [deleteChatBot] = useMutation(DELETE_CHATBOT, {
    refetchQueries: ['GetChatbotById'],
    awaitRefetchQueries: true,
  });
  const [addCharacteristics] = useMutation(ADD_CHARACTERISTIC, {
    refetchQueries: ['GetChatbotById'],
  });
  const [updateChatbot] = useMutation(UPDATE_CHATBOT, {
    refetchQueries: ['GetChatbotById'],
  });
  const { data, loading, error } = useQuery<GetChatbotByIdeResponse>(GET_CHATBOT_BY_ID, { variables: { id } });

  useEffect(() => {
    data && setChatBotName(data.chatbots.name)
  }, [data]);

  useEffect(() => {
    setUrl(`${BASE_URL}/chatbot/${id}`);
  }, [id]);

  const handleUpdateChatBot = () => {
    try {
      const promise = updateChatbot({
        variables: { id, name: chatBotName }
      });
      toast.promise(promise, {
        loading: 'Updating...',
        success: 'Updated!',
        error: 'Error updating chatbot',
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddChars = async (event: any) => {
    event.preventDefault();
    try {
      const promise = addCharacteristics({
        variables: { chatbotId: Number(id), content: newChars }
      });
      toast.promise(promise, {
        loading: 'Adding...',
        success: 'Added!',
        error: 'Error adding fact',
      });
    } catch (error) {
      console.log(error);
    }
    setNewChars('');
  }

  const handleDeleteChatBot = async () => {
    try {
      const promise = deleteChatBot({ variables: { chatbotId: id } });
      toast.promise(promise, {
        loading: 'Deleting...',
        success: 'Deleted!',
        error: 'Error deleting chatbot',
      });
    } catch (error) {
      toast.error('Failed to delete chatbot');
    }
  };

  if (loading) return <div className="m-auto p-10 animate-spin b-red"><LoaderPinwheel size={48} /></div>
  if (error) return <p>Error: {error.message}</p>;
  if (!data?.chatbots) return redirect('/view-chatbots');

  return (
    <div className="px-0 md:p-0">
      <div className="md:sticky md:top-0 z-50 ml-auto space-y-2 md:border mt-5 p-5 rounded-b-lg md:rounded-lg bg-[#2239c9]">
        <h2 className="text-white text-sm font-bold">Link to chat</h2>
        <p className="text-sm text-white">Share this link with customers to start conversation with chatbot</p>
        <div className="flex items-center space-x-2">
          <Link href={url} className='w-full cursor-pointer'>
            <Input value={url} readOnly className="cursor-pointer" />
          </Link>
          <Button
            size='sm'
            className="px-3"
            onClick={() => {
              navigator.clipboard.writeText(url);
              toast.success('Copied!');
            }}
          >
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <section className="relative mt-5 bg-white p-10 rounded-lg">
        <Button
          variant='destructive'
          className="absolute top-2 right-2 h-8 w-2"
          onClick={handleDeleteChatBot}
        >
          X
        </Button>
        <div className="flex space-x-4">
          <Avatar />
          <form
            className="flex flex-1 space-x-2 items-center"
            onSubmit={handleUpdateChatBot}
          >
            <Input
              onChange={(e) => setChatBotName(e.target.value)}
              placeholder="Chatbot name"
              className="w-full bg-transparent text-xl font-bold"
              value={chatBotName}
              required
            />
            <Button type='submit' disabled={!chatBotName}>Update</Button>
          </form>
        </div>
        <h2 className="text-sl font-bold mt-10">Here is what your AI Knows:</h2>
        <div>
          <form onSubmit={handleAddChars} className="flex flex-row gap-4 justify-between">
            <Input
              placeholder="Add a new fact"
              className="w-full bg-transparent text-base"
              value={newChars}
              onChange={(e) => setNewChars(e.target.value)}
            />
            <Button type='submit' disabled={!newChars}>Add</Button>
          </form>
          <ul className="flex flex-wrap-reverse gap-5 mt-10">
            {data?.chatbots?.chatbot_characteristics?.map((char) => (
              <Characteristic key={char.id} characteristic={char} />
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
};