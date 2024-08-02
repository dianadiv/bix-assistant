'use client'

import { Chatbot } from "@/types/types";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@radix-ui/react-accordion";
import { BotMessageSquare, ChevronDown } from "lucide-react";
import Link from "next/link";
import ReactTimeAgo from "react-timeago";

export default function ChatbotSessions({ chatbots }: { chatbots: Chatbot[] }) {
  return (
    <div>
      <Accordion type='single' collapsible>
        {chatbots?.map((chatbot: Chatbot) => {
          const hasSessions = chatbot.chat_sessions.length > 0;
          return (
            <AccordionItem key={chatbot.id} value={`item-${chatbot.id}`} className="px-10 py-5 hover:shadow-2xl" >
              {hasSessions
                ? <><AccordionTrigger className="w-full">
                  <div className="flex text-left items-center w-full">
                    <BotMessageSquare />
                    <div className="flex flex-1 justify-between space-x-4 ml-3">
                      <p>{chatbot.name}</p>
                      <p className="font-bold text-right pr-4">{chatbot.chat_sessions.length} sessions</p>
                    </div>
                    <ChevronDown />
                  </div>
                </AccordionTrigger>
                  <AccordionContent className="space-y-5 p-5 bg-gray-100 rounded-md">
                    {chatbot.chat_sessions.map((session) => {
                      return (
                        <Link href={`/review-sessions/${session.id}`} key={session.id} className="relative p-10 bg-[#2239c9] text-white block rounded-md">
                          <p className="text-lg font-bold">{session.guests?.name || 'No name'}</p>
                          <p className="text-sm font-bold">{session.guests?.email || 'No email'}</p>
                          <p className="absolute top-5 right-5 text-sm">
                            <ReactTimeAgo date={new Date(session.created_at)} />
                          </p>
                        </Link>
                      )
                    })}
                  </AccordionContent>
                </>
                : <p className="font-light">{chatbot.name} (No chat sessions found for this chatbot)</p>
              }
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}