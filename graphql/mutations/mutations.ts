import { gql } from "@apollo/client";

export const CREATE_CHATBOT = gql`
  mutation CreateChatbot($clerk_user_id: String!, $name: String!) {
    insertChatbots(clerk_user_id: $clerk_user_id, name: $name, created_at: "${new Date().toISOString()}") {
      id
      name
      created_at
    }
  }
`;

export const REMOVE_CHARS = gql`
  mutation RemoveCharacteristics($characteristicId: Int!) {
    deleteChatbot_characteristics(id: $characteristicId) {
      id
    }
  }
`;

export const DELETE_CHATBOT = gql`
  mutation DeleteChatbots($chatbotId: Int!) {
    deleteChatbots(id: $chatbotId) {
      id
    }
  }
`;


export const ADD_CHARACTERISTIC = gql`
  mutation AddCharacteristics($chatbotId: Int!, $content: String!) {
    insertChatbot_characteristics(chatbot_id: $chatbotId, content: $content, created_at: "${new Date().toISOString()}") {
      id
      content
      created_at
    }
  }
`;

export const UPDATE_CHATBOT = gql`
  mutation UpdateChatbot($id: Int!, $name: String!) {
    updateChatbots(id: $id, name: $name) {
      id
      name
      created_at
    }
  }
`;