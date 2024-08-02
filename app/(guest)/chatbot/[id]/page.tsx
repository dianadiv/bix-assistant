'use client';
import Avatar from "@/components/Avatar";
import Messages from "@/components/Messages";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GET_CHATBOT_BY_ID, GET_MESSAGES_BY_CHAT_SESSION_ID } from "@/graphql/queries/queries";
import startNewChat from "@/lib/startNewChat";
import { GetChatbotByIdeResponse, Message, MessagesByIdResponse } from "@/types/types";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  message: z.string().min(2, 'Your message is too short'),
})

interface UserData {
  name: string;
  email: string;
}

export default function ChatbotPage({ params: { id } }: { params: { id: string } }) {
  const [userData, setUserData] = useState<UserData>({} as UserData);
  const [isOpen, setIsOpen] = useState(true);
  const [chatId, setChatId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [messages, setMessage] = useState<Message[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: '' },
  });

  const { data: chatbots } = useQuery<GetChatbotByIdeResponse>(GET_CHATBOT_BY_ID, { variables: { id } });
  const { data, error, loading: loadingQuesry } = useQuery<MessagesByIdResponse>(GET_MESSAGES_BY_CHAT_SESSION_ID,
    { variables: { chat_session_id: chatId }, skip: !chatId });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const chatId = await startNewChat(userData.name, userData.email, Number(id));

    setChatId(chatId);
    setLoading(false);
    setIsOpen(false);
  }

  useEffect(() => {
    data && setMessage(data.chat_sessions.messages);
  }, [data]);

  async function onSubmit (values: z.infer<typeof formSchema>) {
    if (!userData.name || !userData.email) {
      setIsOpen(true);
      return;
    }

    setLoading(true);
    const { message: formMessage } = values;
    const message = formMessage;
    if (!message.trim()) {
      return;
    }
    form.reset();
    
    const userMessage: Message = {
      id: Date.now(),
      content: message,
      created_at: new Date().toISOString(),
      chat_session_id: chatId,
      sender: 'user',
    }

    const loadingMessage: Message = {
      id: Date.now() + 1,
      content: 'Thinking...',
      created_at: new Date().toISOString(),
      chat_session_id: chatId,
      sender: 'ai',
    }

    setMessage(prev => [...prev, userMessage, loadingMessage]);

    try {
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name, chat_session_id: chatId, content: message, chatbot_id: id
        }),
      });

      const result = await response.json();

      setMessage(prev => 
        prev.map(message => message.id === loadingMessage.id ? { ...message, content: result.content } : message)
      )
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="w-full h-[100vh] bg-gray-100">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Lets help you out</DialogTitle>
              <DialogDescription>I just need a few details to get started</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id='name'
                  value={userData.name}
                  onChange={e => setUserData({ ...userData, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input
                  id='email'
                  value={userData.email}
                  onChange={e => setUserData({ ...userData, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!userData.name || !userData.email || loading}>
                {!loading ? 'Start Chatting' : 'Loading...'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col w-full max-w-3xl mx-auto bg-white md:rounded-t-lg shadow-2xl md:mt-10 h-[90vh]">
        <div className="p-4 border-b sticky top-0 z-50 bg-[#2239c9] px-10 text-white md:rounded-t-lg flex items-center space-x-4">
          <Avatar />
          <div>
            <h1 className="truncate text-lg">{chatbots?.chatbots.name}</h1>
            <p className="text-sm text-gray-300">Typically replies instantly</p>
          </div>
        </div>
        <Messages messages={messages} />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-start sticky bottom-0 z-50 space-x-4 drop-shadow-lg p-4 bg-gray-100 rounded-md">
            <FormField
              control={form.control}
              name='message'
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel hidden>Message</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type a message"
                      {...field}
                      className="p-8"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="h-full"
              disabled={form.formState.isSubmitting || !form.formState.isValid}
            >
              Send
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
