import { BotMessageSquare, PencilLine, SearchIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function SideBar() {
  const link = (href: string, title: string, subTitle: string, icon: React.ElementType) => {
    return (
      <li className="flex-1">
        <Link
          href={href}
          className="flex flex-col text-center lg:text-left lg:flex-row items-center gap-2 p-2 rounded-md bg-[#2239c9]"
        >
          {React.createElement(icon, { className: "h-6 w-6 lg:h-8 lg:w-8" })}
          <div className="hidden md:inline">
            <p className="text-xl">{title}</p>
            <p className="text-sm">{subTitle}</p>
          </div>
        </Link>
      </li>
    )
  }
  return (
    <div className="bg-white text-white p-5">
      <ul className="gap-5 flex lg:flex-col">
        {link("/create-chat", "Create", "Chatbots", BotMessageSquare)}
        {link("/view-chatbots", "Edit", "Chatbots", PencilLine)}
        {link("/review-sessions", "View", "Sessions", SearchIcon)}
      </ul>
    </div>
  )
}
