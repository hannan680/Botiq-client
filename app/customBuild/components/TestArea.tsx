"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { useChatContext } from "../../providers/chatContext";
import RefinementSidePanel from "./RefinementModal";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useUserContext } from "@/app/providers/userContext";
import { useDeployCustomEmployee } from "@/app/hooks/useDeployCustomEmployee";
import LoadingOrSuccessAnimationModal from "./LoadingOrSuccessOrErrorModal";
import { useRouter } from "next/navigation";
import DeployEmployee from "./DeployEmployee";
import { FlaskConical } from "lucide-react";

export const TestArea: React.FC = () => {
  const {
    messages,
    sendMessageToModel,
    activeModel,
    streamingMessage,
    testMessageIndex,
    refinementMessageIndices,
    setRefinementMessageIndices,
    setPromptMessageIndices,
    promptMessageIndices,
    generatedPrompt,
    setTestMessageIndex,
    resetContext
  } = useChatContext();
  const {userData} = useUserContext();
  const [inputValue, setInputValue] = useState<string>("");
  const [showRefinementModal, setShowRefinementModal] = useState<boolean>(false);
  const [disLikeMessage, setDisLikeMessage] = useState<string>("");

  const [isDeploying, setIsDeploying] = useState(false);
  const [isSuccessDeploying, setIsSuccessDeploying] = useState(false);
  const [isErrorDeploying, setIsErrorDeploying] = useState(false);

  const { mutate:deployCustomEmployee, isPending:isPendingDeploying, isSuccess:isDeployed, isError, error } = useDeployCustomEmployee();
  
  const router =useRouter();

  const scrollViewportRef = useRef<HTMLDivElement | null>(null); // Reference to the scrollable viewport
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState<boolean>(true); // Auto-scroll state

  
  // Scroll to bottom whenever messages change, only if auto scroll is enabled
  useEffect(() => {
    if (scrollViewportRef.current && isAutoScrollEnabled) {
      const scrollView = scrollViewportRef.current;
      if (scrollView) {
        scrollView.scrollTop = scrollView.scrollHeight;
      }
    }
  }, [messages, streamingMessage, isAutoScrollEnabled]);

  // Handle user scroll to check if they manually scroll up
  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const scrollView = e.currentTarget;
    const isAtBottom =
      scrollView.scrollHeight - scrollView.scrollTop <= scrollView.clientHeight + 10; // Adjust for small offsets
    setIsAutoScrollEnabled(isAtBottom); // Enable auto-scroll only if the user is at the bottom
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage = {
      role: "user",
      content: [{ type: "text", text: inputValue }],
    };

    setInputValue("");
    await sendMessageToModel(newMessage);
  };

  const handleDislikeResponse = (message: string) => {
    setDisLikeMessage(message);
    setShowRefinementModal(true);
  };

  const handleRefinePrompt = async (feedback: string) => {
    const refineMessagePrompt = {
      role: "user",
      content: [
        {
          type: "text",
          text: `I don't like this response: ${disLikeMessage}. Refine the prompt based on the following feedback and continue the conversation without returning an updated prompt or from where we left: ${feedback}`,
        },
      ],
    };

    setRefinementMessageIndices((prevIndices) => [
      ...prevIndices,
      messages[activeModel!].length,
    ]);
    await sendMessageToModel(refineMessagePrompt);
  };

  const handleTestClick = async () => {
    const testMessage = {
      role: "user",
      content: [
        {
          type: "text",
          text: "Let's test the generated prompt. You act as the chatbot, I will act as a customer. You send the first message and don't reveal that you are AI until someone wants to refine the prompt.",
        },
      ],
    };
    await setTestMessageIndex(messages[activeModel!].length);
    sendMessageToModel(testMessage);
};




  if(!generatedPrompt){
   return  (<div className="flex flex-col w-full items-center justify-center h-full text-center">
            <AiOutlineInfoCircle className="text-7xl text-gray-400 mb-4 animate-pulse" />
            <p className="text-gray-600 text-lg font-semibold">
              No prompt generated yet.
            </p>
            <p className="text-gray-500">
              Click on "Generate Prompt" to get started.
            </p>
          </div>)
  }



  return (
    <div className="flex-1 flex flex-col border-0 rounded-none">
      <RefinementSidePanel
        isVisible={showRefinementModal}
        onClose={() => {
          setShowRefinementModal(false);
          setDisLikeMessage("");
        }}
        onSubmit={handleRefinePrompt}
      />
    
     {generatedPrompt && <div className="border-t p-5 bg-gray-50 rounded-b-lg flex items-center justify-end">
        {!testMessageIndex && <button onClick={handleTestClick} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all">
         Test <FlaskConical size={16}/>
        </button>}
        <DeployEmployee generatedPrompt={generatedPrompt} />
      </div>}
      <div className="h-[calc(100vh-150px)] p-4 overflow-y-auto" ref={scrollViewportRef}>
        {messages[activeModel!].map((message, index) => (
          <React.Fragment key={index}>
            {index === testMessageIndex ? (
              <div className="flex justify-center items-center my-2">
                <hr className="flex-grow border-t border-gray-300" />
                <span className="mx-2 text-sm text-gray-500">Test Mode</span>
                <hr className="flex-grow border-t border-gray-300" />
              </div>
            ) : refinementMessageIndices.includes(index) ? (
              <div className="flex justify-center items-center my-2">
                <hr className="flex-grow border-t border-gray-300" />
                <span className="mx-2 text-sm text-gray-500">Refined Response</span>
                <hr className="flex-grow border-t border-gray-300" />
              </div>
            ) : (
              !refinementMessageIndices.includes(index) &&
              !promptMessageIndices.includes(index) &&
              testMessageIndex != null &&
              index > testMessageIndex && (
                <ChatMessage
                  message={message.content[0].text}
                  isUser={message.role === "user"}
                  isShowDislike={
                    message.role !== "user" &&
                    testMessageIndex != null &&
                    index > testMessageIndex
                  }
                  onDislike={() => {
                    handleDislikeResponse(message.content[0].text);
                  }}
                />
              )
            )}
          </React.Fragment>
        ))}
        {streamingMessage && (
          <ChatMessage message={streamingMessage} isUser={false} />
        )}
      </div>
      <footer className="border-t p-4">
        {generatedPrompt && testMessageIndex && (
          <form className="flex w-full items-center space-x-2" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 h-[50px] px-5 border rounded-md bg-gray-200 text-gray-900"
              value={inputValue}
              onChange={handleInputChange}
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Send
            </button>
          </form>
        )}
      </footer>
    </div>
  );
};
