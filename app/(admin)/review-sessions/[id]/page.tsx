import Messages from "@/components/Messages";
import { GET_CHAT_SESSION_MESSAGES } from "@/graphql/queries/queries";
import serverClient from "@/lib/server/serverClient";
import { GetChatSessionsMessageResponse, GetChatSessionsMessageVariables } from "@/types/types";

export const dynamic = 'force-dynamic';

export default async function ReviewSession({ params: { id } }: { params: { id: string } }) {
  const { data: {chat_sessions} } = await serverClient.query<
    GetChatSessionsMessageResponse, GetChatSessionsMessageVariables>({
      query: GET_CHAT_SESSION_MESSAGES,
      variables: { id: parseInt(id as string) }
    });

  return (
    <div className="flex-1 p-10 pb-24">
      <h1 className="text-sl lg:text-3xl font-semibold">Session Review</h1>
      <p className="font-light text-xs text-gray-400 mt-2">Started at {new Date(chat_sessions.created_at).toLocaleString()}</p>
      <h2 className="font-light mt-2">Between {chat_sessions.chatbots.name} & {chat_sessions.guests.name} ({chat_sessions.guests.email})</h2>
      <Messages messages={chat_sessions.messages}/>
    </div>
  )
}