'use client';

import { Message } from "@/types/types";
import clsx from "clsx";
import { Bot, SquareUserRound } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Messages({ messages }: { messages: Message[]}) {
  const path = usePathname();
  const isReviewPage = path.includes('review-sessions');

  return (
    <div className="flex-1 flex flex-col overflow-y-auto space-y-10 py-10 px-5 bg-white rounded-lg mt-10">
      {messages.map((message) => {
        const isSender = message.sender !== 'user';
        return (
          <div key={message.id} className={clsx(isSender ? 'chat-start' : 'chat-end', 'chat relative')}>
            {isReviewPage && <p className="text-xs text-gray-300 absolute -bottom-5">sent {new Date(message.created_at).toLocaleString()}</p>}
            <div className={clsx('chat-image avatar w-10', !isSender && '-mr-4')}>{isSender ? <Bot /> : <SquareUserRound />}</div>
            <p
              className={clsx('chat-bubble text-white', isSender ? 'chat-bubble-primary bg-[#2239c9]' : 'chat-bubble-secondary bg-gray-200 text-gray-700')}>
              {message.content}
            </p>
          </div>)
      })}
    </div>
  )
}