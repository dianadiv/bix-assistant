import ChatbotSessions from "@/components/ChatbotSessions";
import { GET_USER_CHATBOTS } from "@/graphql/queries/queries";
import serverClient from "@/lib/server/serverClient";
import { GetChatbotsByUserData, GetChatbotsByUserDataVariables } from "@/types/types";
import { auth } from "@clerk/nextjs/server";

export default async function ReviewSessions() {
  const { userId } = await auth();
  if (!userId) return;

  const { data: { chatbotsByUserId } } = await serverClient.query<
    GetChatbotsByUserData, GetChatbotsByUserDataVariables
  >({
    query: GET_USER_CHATBOTS,
    variables: { clerk_user_id: userId }
  })

  return (
    <div className="flex-1 px-10">
      <h1 className="text-sl lg:text-3xl font-semibold mt-10">Chat Sessions</h1>
      <h2 className="mb-5">Review all the chat sessions the chat bots have had with your customers</h2>
      <ChatbotSessions chatbots={chatbotsByUserId} />
    </div>
  )
}