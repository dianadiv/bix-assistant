import client from "@/graphql/apolloClient";
import { INSERT_CHAT_SESSION, INSERT_GUEST, INSERT_MESSAGE } from "@/graphql/mutations/mutations";
import { gql } from "@apollo/client";

async function startNewChat(name: string, email: string, chatbotId: number) {
  try {
    const guestResult = await client.mutate({
      mutation: INSERT_GUEST,
      variables: { name, email }
    })
    const guestId = guestResult.data.insertGuests.id;

    const chatSessionResult = await client.mutate({
      mutation: INSERT_CHAT_SESSION,
      variables: { chatbot_id: chatbotId, guest_id: guestId }
    })
    const chatSessionId = chatSessionResult.data.insertChat_sessions.id;

    await client.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chat_session_id: chatSessionId,
        content: `Hello ${name}, how can I help you today?`,
        sender: 'ai'
      }
    })

    return chatSessionId;
  } catch (error) {
    console.error(error);
  }
}

export default startNewChat;