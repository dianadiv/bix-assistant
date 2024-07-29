'use client'

import { REMOVE_CHARS } from "@/graphql/mutations/mutations";
import { ChatbotCharacteristic } from "@/types/types"
import { useMutation } from "@apollo/client";
import { OctagonPause, OctagonX } from "lucide-react";
import { toast } from "sonner";

interface Props {
  characteristic: ChatbotCharacteristic;
}

export default function Characteristic({ characteristic }: Props) {
  const [removeChars] = useMutation(REMOVE_CHARS, {
    refetchQueries: ['GetChatbotById']
  });

  const handleRemoveChars = async () => {
    try {
      await removeChars({ variables: { characteristicId: characteristic.id } });
    } catch (error) {
      console.log(error);
    };
  };

  return (
    <li className="relative p-10 bg-white border rounded-md">
      {characteristic.content}
      <OctagonX
        className="w-6 h-6 absolute top-1 right-1 cursor-pointer hover:opacity-50"
        onClick={() => {
          const promise = handleRemoveChars();
          toast.promise(promise, {
            loading: 'Removing...',
            success: 'Removed!',
            error: 'Error removing characteristic',
          });
        }}
      />
    </li>
  )
}
