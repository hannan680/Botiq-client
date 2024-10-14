

import React, { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import RefinementSidePanel from "./RefinementModal";
import Link from "next/link";
import { useChatContext } from "../../providers/chatContext";
import { ChatMessage } from "./ChatMessage";
import AiModalSelection from "./AiModelSelection";
import CreatePrompt from "./CreatePrompt";
import ChatInputForm from "./ChatInputForm";
import PromptReadyModal from "./PromptReadyModal";
import { useRouter } from "next/navigation";
import { SwitchCamera } from "lucide-react";

interface MessageContent {
  type: string;
  text: string;
}

interface Message {
  role: string;
  content: MessageContent[];
}

export const ChatArea = () => {
  const {
    messages,
    sendMessageToModel,
    setMessages,
    activeModel,
    streamingMessage,
    testMessageIndex,
    refinementMessageIndices,
    setRefinementMessageIndices,
    generatedPrompt,
    resetContext,
    promptMessageIndex,
    setActiveModel,
  } = useChatContext();

  const [inputValue, setInputValue] = useState<string>("");
  const [showRefinementModal, setShowRefinementModal] = useState<boolean>(false);
  const [disLikeMessage, setDisLikeMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);



  const scrollViewportRef = useRef<HTMLDivElement | null>(null);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState<boolean>(true); // Auto-scroll state

  const router = useRouter();

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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      role: "user",
      content: [{ type: "text", text: inputValue }],
    };

    setInputValue("");
    await sendMessageToModel(newMessage);
    setIsLoading(false);
  };

  const handleSendPredefinedPrompt = async () => {
    const newMessage: Message = {
      role: "user",
      content: [{ type: "text", text: "Create Prompt" }],
    };

    await sendMessageToModel(newMessage);
  };

  const handleDislikeResponse = (message: string) => {
    setDisLikeMessage(message);
    setShowRefinementModal(true);
  };

  const handleRefinePrompt = async (feedback: string) => {
    const refineMessagePrompt: Message = {
      role: "user",
      content: [
        {
          type: "text",
          text: `I don't like this response: ${disLikeMessage}. Refine the prompt based on the following feedback and continue the conversation without returning updated prompt or from where we left: ${feedback}`,
        },
      ],
    };

    setRefinementMessageIndices((prevIndices) => [
      ...prevIndices,
      messages[activeModel!].length,
    ]);
    await sendMessageToModel(refineMessagePrompt);
  };

  const handleRegenratePrompt = () => {
    resetContext();
  };

  const handleSwitchModel = () => {
    alert("Are you sure you want to change model?")
    setMessages((prev) => ({
      ...prev,
      [activeModel!]: [ ],
    }));
    setActiveModel(null);
  };


  if (activeModel === null) {
    return <AiModalSelection />;
  }

  if (messages[activeModel].length === 0 ) {
    return <CreatePrompt />;
  }

  return (
    <div className="flex-1 flex flex-col border-0 rounded-none">
        <button
        onClick={handleSwitchModel}
        className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
        aria-label="Switch model"
      >
        <SwitchCamera size={24} />
      </button>
      <PromptReadyModal
        isOpen={generatedPrompt ? true : false}
        onClose={() => {}}
        onRegeneratePrompt={handleRegenratePrompt}
        onSeePrompt={() => {
          router.push("/customBuild/inspect-prompt");
        }}
      />
      <RefinementSidePanel
        isVisible={showRefinementModal}
        onClose={() => {
          setShowRefinementModal(false);
          setDisLikeMessage("");
        }}
        onSubmit={handleRefinePrompt}
      />
      <div className="border-b p-4">
        <h1 className="text-2xl font-bold">Bot IQ</h1>
      </div>
      <div className="p-0 h-[calc(100vh-150px)] flex-grow">
        <div
          ref={scrollViewportRef}
          className="h-full p-4 space-y-4 overflow-y-auto"
          onScroll={handleScroll} // Add scroll event listener
        >
          {messages[activeModel].map((message: any, index: any) => (
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
              ) : index === promptMessageIndex ? (
                <ChatMessage
                  message={"Prompt Generated"}
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
              ) : (
                !refinementMessageIndices.includes(index) &&
                (index < testMessageIndex! || testMessageIndex === null) && (
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
          {streamingMessage && <ChatMessage message={streamingMessage} isUser={false} />}
        </div>
      </div>
      <div className=" p-4">
        {generatedPrompt ? (
          <div className="flex w-full h-full justify-center items-center">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg ml-4"
              onClick={handleRegenratePrompt}
            >
              Regenerate Prompt
            </button>
            <Link href="/chat/prompt">
              <button className="bg-blue-500 text-white py-2 px-4 rounded-lg ml-4">
                See Prompt
              </button>
            </Link>
          </div>
        ) : (
          <ChatInputForm
            inputValue={inputValue}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            streamingMessage={streamingMessage}
            isLoading={isLoading || messages[activeModel].length===1}
          />
        )}
      </div>
    </div>
  );
};
