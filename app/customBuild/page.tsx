"use client";

import React from "react";
import { ChatArea } from "./components/ChatArea";

import ChatLayout from "./layout";
import AiModalSelection from "./components/AiModelSelection";
import CreatePrompt from "./components/CreatePrompt";
import { ChatProvider } from "../providers/chatContext";

const ChatUI: React.FC = () => {
  return (
    // <ChatProvider>
 
      <ChatArea />
  
    // </ChatProvider>
  );
};

export default ChatUI;
