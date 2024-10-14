import React from "react";
import ReactMarkdown from "react-markdown";
import { AiOutlineDislike } from "react-icons/ai";
import { useUserContext } from "@/app/providers/userContext";
import Image from "next/image";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  onDislike?: () => void;
  isShowDislike?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isUser,
  onDislike,
  isShowDislike = false,
}) =>{
  
   const {userData}=useUserContext();

  return(
  <div className={`flex flex-col ${isUser ? "items-end" : "items-start"} my-2`}>
    <div className="max-w-[80%] flex items-start space-x-2">
      {!isUser && (
        <div className="flex items-center justify-center h-10 w-10 flex-shrink-0 self-end rounded-full">
          {/* <span className="text-sm text-gray-800">IQ</span> */}
          <Image src="/images/bot.png" width={100} height={100} alt="chat bot" />
        </div>
      )}
      <div
        className={`py-4 px-6  ${
          isUser ? "bg-[#E0F8FF] text-black rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-none" : "bg-[#1D7ED5] text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-none rounded-br-2xl"
        }`}
      >
        <ReactMarkdown>{message}</ReactMarkdown>
      </div>
      {isUser && (
        <div className="flex items-center justify-center h-10 w-10 flex-shrink-0 self-end bg-gray-300 rounded-full rounded-t-full">
          <span className="text-sm text-gray-800">{userData?.userName ? userData?.userName.substring(0,2) : "JD"}</span>
        </div>
      )}
      {isShowDislike && (
        <button
          onClick={onDislike}
          className="flex self-end p-3 text-sm text-red-500 hover:text-red-700"
          aria-label="Dislike"
        >
          <AiOutlineDislike size={20} />
        </button>
      )}
    </div>
  </div>
)};
