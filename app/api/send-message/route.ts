import { INSERT_MESSAGE } from "@/graphql/mutations/mutations";
import { GET_CHATBOT_BY_ID, GET_MESSAGES_BY_CHAT_SESSION_ID } from "@/graphql/queries/queries";
import serverClient from "@/lib/server/serverClient";
import { Message } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export const runtime = 'edge'
export async function POST(req: NextRequest) {
  const { chat_session_id, chatbot_id, content, name } = await req.json();
console.log(chat_session_id, chatbot_id, content, name )
  try {
    const { data } = await serverClient.query({
      query: GET_CHATBOT_BY_ID,
      variables: { id: chatbot_id },
    });

    if (!data.chatbots) {
      return NextResponse.json({ error: 'Chatbot not found' }, { status: 404 });
    }

    const { data: messagesData } = await serverClient.query({
      query: GET_MESSAGES_BY_CHAT_SESSION_ID,
      variables: { chat_session_id },
      fetchPolicy: 'no-cache',
    });

    const messages = messagesData.chat_sessions.messages;
    const formattedMessages = messages.map((message: Message) => ({
      role: message.sender === 'ai' ? 'system' : 'user',
      name: message.sender === 'ai' ? 'system' : name,
      content: message.content,
    }));

    const systemPrompt = data.chatbots.chatbot_characteristics.map((char: any) => char.content).join(' + ');
    const messagesParams = [
      {
        role: 'system', name: 'system',
        content: `You are a helpful assistant for customers. If a generic question is asked which is not relelevant,
        kindly inform user that you are not allowed to search for a specific content. Use Emojis where possible.
        Here is some key information that you need to be aware of: ${systemPrompt}`
      },
      ...formattedMessages,
      { role: 'user', name, content },
    ];

    const openaiResponse = await openai.chat.completions.create({ messages, model: 'gpt-3.5-turbo' });
    const aiResponce = openaiResponse?.choices?.[0]?.message?.content?.trim();
    if (!aiResponce) {
      return NextResponse.json({ error: 'AI response not found' }, { status: 500 });
    }

    await serverClient.mutate({
      mutation: INSERT_MESSAGE,
      variables: { chat_session_id, content, sender: 'user' },
    });

    const aiMessageResult = await serverClient.mutate({
      mutation: INSERT_MESSAGE,
      variables: { chat_session_id, content: aiResponce, sender: 'ai' },
    });

    return NextResponse.json({ id: aiMessageResult.data.insertMessages.id, content: aiResponce });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}