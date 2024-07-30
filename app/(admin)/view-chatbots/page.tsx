import { Button } from "@/components/ui/button";
import { GET_CHATBOT_BY_USER } from "@/graphql/queries/queries";
import serverClient from "@/lib/server/serverClient";
import { Chatbot, GetChatbotsByUserData, GetChatbotsByUserDataVariables } from "@/types/types";
import { auth } from "@clerk/nextjs/server";
import { BotMessageSquare } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function ViewChatbots() {
  const { userId } = await auth();
  if (!userId) return;

  const { data: { chatbotsByUserId } } = await serverClient.query<
    GetChatbotsByUserData, GetChatbotsByUserDataVariables>({
      query: GET_CHATBOT_BY_USER,
      variables: { clerk_user_id: userId },
    })

  return (
    <div className="flex-1 pb-20 p-10">
      <h1 className="text-xl lg:text-3xl font-semibold mb-5">Active Chatbots</h1>
      {chatbotsByUserId?.length === 0 && (
        <div>
          <p>You have not created any chatbots yet</p>
          <Link href='/create-chatbot'>
            <Button className="bg-[#2239c9] text-white p-3 rounded-md mt-5">Create Chatbot</Button>
          </Link>
        </div>
      )}
      <ul className="flex flex-col space-y-5">
        {chatbotsByUserId?.map((chatbot: Chatbot) => (
          <Link key={chatbot.id} href={`/edit-chat/${chatbot.id}`}>
            <li className="relative p-10 border rounded max-w-3xl bg-white">
              <div>
                <div className="flex items-center space-x-4">
                  <BotMessageSquare />
                  <h2 className="text-sl ">{chatbot.name}</h2>
                </div>
                <p className="absolute top-5 right-5 text-xs text-gray-400">Created: {new Date(chatbot.created_at).toLocaleString()}</p>
              </div>
              <div className="grid grid-cols-2 gap-10 md:gap-5 p-5">
                <h3 className="italic">Characteristics</h3>
                <ul className="text-xs">
                  {!chatbot.chatbot_characteristics.length && <p>No characteristics added yet</p>}
                  {chatbot.chatbot_characteristics?.map((characteristic) => (
                    <li
                      key={characteristic.id}
                      className="list-disc break-words"
                    >
                      {characteristic.content}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  )
}

export default ViewChatbots;