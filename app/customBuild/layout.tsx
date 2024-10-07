"use client";

import React, { ReactNode } from "react";
import  Sidebar  from "./components/Sidebar";
import { ChatProvider } from "../providers/chatContext";

interface ChatLayoutProps {
  children: ReactNode; // Define the type for children as ReactNode
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ children }) => {
  return (
    <ChatProvider>
      <div className="flex h-screen bg-background text-foreground w-full">
        
        <Sidebar />
        <div className="flex-1 flex">{children}</div>
      </div>
    </ChatProvider>
  );
};

export default ChatLayout;
