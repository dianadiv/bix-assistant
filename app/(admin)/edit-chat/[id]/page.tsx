'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BASE_URL } from "@/graphql/apolloClient";
import { Copy } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditChat({params: {id}}: {params: {id: string}}) {
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    setUrl(`${BASE_URL}/chatbot/${id}`);
  }, [id]);

  return (
    <div className="px-0 md:p-0">
      <div className="md:sticky md:top-0 z-50 ml-auto sm:max-w-sm space-y-2 md:border p-5 rounded-b-lg md:rounded-lg bg-[#2239c9]">
        <h2 className="text-white text-sm font-bold">Link to chat</h2>
        <p className="text-sm text-white">Share this link with customers to start conversation with chatbot</p>
        <div className="flex items-center space-x-2">
          <Link href={url} className='w-full cursor-pointer'>
            <Input value={url} readOnly className="cursor-pointer"/>
          </Link>
          <Button
            size='sm'
            className="px-3"
            onClick={() => {
              navigator.clipboard.writeText(url);
              toast.success('Copied!');
            }}
          >
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4"/>
          </Button>
        </div>
      </div>
    </div>
  )
}
