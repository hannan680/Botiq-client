"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useChatGPTRequest } from "../hooks/useChatGptRequest";
import { useClaudeRequest } from "../hooks/useClaudeRequest";
import { useUserContext } from "./userContext";

// Define message and model types
interface MessageContent {
  type: string;
  text: string;
}

interface Message {
  role: string;
  content: MessageContent[];
}

interface Messages {
  [key: string]: Message[];
}

interface ChatContextType {
  Models: typeof Models;
  activeModel: string | null;
  activeModelKey:string|null;
  setActiveModelKey:React.Dispatch<React.SetStateAction<string|null>>;
  setActiveModel: React.Dispatch<React.SetStateAction<string|null>>;
  messages: Messages;
  setMessages: React.Dispatch<React.SetStateAction<Messages>>;
  gptThreadId: string | null;
  setGptThreadId: React.Dispatch<React.SetStateAction<string | null>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  streamingMessage: string;
  setStreamingMessage: React.Dispatch<React.SetStateAction<string>>;
  isStreaming: boolean;
  setIsStreaming: React.Dispatch<React.SetStateAction<boolean>>;
  showToast: boolean;
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
  promptMessageIndex: number | null;
  setPromptMessageIndex: React.Dispatch<React.SetStateAction<number | null>>;
  promptMessageIndices: number[];
  setPromptMessageIndices: React.Dispatch<React.SetStateAction<number[]>>;
  testMessageIndex: number | null;
  setTestMessageIndex: React.Dispatch<React.SetStateAction<number | null>>;
  refinementMessageIndices: number[];
  setRefinementMessageIndices: React.Dispatch<React.SetStateAction<number[]>>;
  isRefinementModalVisible: boolean;
  setRefinementModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  generatedPrompt: string;
  setGeneratedPrompt: React.Dispatch<React.SetStateAction<string>>;
  sendMessageToModel: (newMessage: Message) => Promise<any>;
  resetContext: () => void;
}

// Models Constants
const Models = Object.freeze({
  CHATGPT: "chatgpt",
  CLAUDE: "claude",
});

// Create context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provide context
interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const {ssoKey}=useUserContext();
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const [activeModelKey, setActiveModelKey] = useState<string | null>(null);
  const [messages, setMessages] = useState<Messages>({
    [Models.CHATGPT]: [],
    [Models.CLAUDE]: [],
  });
  const [gptThreadId, setGptThreadId] = useState<string | null>(null);
  const [input, setInput] = useState<string>("");
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [promptMessageIndex, setPromptMessageIndex] = useState<number | null>(
    null
  );
  const [promptMessageIndices, setPromptMessageIndices] = useState<number[]>(
    []
  );
  const [testMessageIndex, setTestMessageIndex] = useState<number | null>(null);
  const [refinementMessageIndices, setRefinementMessageIndices] = useState<
    number[]
  >([]);
  const [isRefinementModalVisible, setRefinementModalVisible] =
    useState<boolean>(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");

  const { mutate: sendChatGPTMessage, isPending: isChatGPTLoading } =
    useChatGPTRequest();
  const { mutate: sendClaudeMessage, isPending: isClaudeLoading } =
    useClaudeRequest();

  const sendMessageToModel = (newMessage: Message): Promise<any> => {
    return new Promise((resolve, reject) => {
      let streamedResponse = "";
      setIsStreaming(true);

      setMessages((prev) => ({
        ...prev,
        [activeModel!]: [...prev[activeModel!], newMessage],
      }));

      const handleSuccess = (response: string, model: string) => {
        setIsStreaming(false);
        setStreamingMessage("");
        setMessages((prev) => ({
          ...prev,
          [model]: [
            ...prev[model],
            { role: "assistant", content: [{ type: "text", text: response }] },
          ],
        }));

        handlePromptDetection(response, (prompt) => {
          if (prompt) {
            setGeneratedPrompt(prompt);
            setPromptMessageIndex(messages[activeModel!].length + 1);
            setPromptMessageIndices((prev) => [
              ...prev,
              messages[activeModel!].length + 1,
            ]);
            resolve({ response, prompt });
          } else {
            resolve({ response, prompt: null });
          }
        });
      };

      const handleError = (errorMessage: string, model: string) => {
        setIsStreaming(false);
        setStreamingMessage("");
        setMessages((prev) => ({
          ...prev,
          [model]: [
            ...prev[model],
            {
              role: "assistant",
              content: [{ type: "text", text: errorMessage }],
            },
          ],
        }));
        reject(new Error(errorMessage));
      };

      if (activeModel === Models.CHATGPT) {
        sendChatGPTMessage(
          {
            message: newMessage.content[0].text,
            threadId: gptThreadId,
            apiKey:activeModelKey!,
            setThreadId: setGptThreadId,
            ssoKey:ssoKey!,
            onChunk: (chunk: string) => {
              streamedResponse += chunk;
              setStreamingMessage(streamedResponse);
            },
          },
          {
            onSuccess: () => handleSuccess(streamedResponse, Models.CHATGPT),
            onError: () =>
              handleError("Error processing your request", Models.CHATGPT),
          }
        );
      } else if (activeModel === Models.CLAUDE) {
        sendClaudeMessage(
          {
            message: newMessage,
            previousMessages: messages[Models.CLAUDE],
            apiKey:activeModelKey!,
            ssoKey:ssoKey!,
            onChunk: (chunk: string) => {
              streamedResponse += chunk;
              setStreamingMessage(streamedResponse);
            },
          },
          {
            onSuccess: () => handleSuccess(streamedResponse, Models.CLAUDE),
            onError: (error: Error) =>
              handleError(`Error: ${error.message}`, Models.CLAUDE),
          }
        );
      }
    });
  };

  const handleSuccess = (response: string, model: string) => {
    setMessages((prev) => ({
      ...prev,
      [model]: [
        ...prev[model],
        {
          role: model === Models.CHATGPT ? "system" : "assistant",
          content: [{ type: "text", text: response }],
        },
      ],
    }));

    handlePromptDetection(response, (prompt) => {
      setGeneratedPrompt(prompt!);
      setPromptMessageIndex(messages[activeModel!].length + 1);
    });

    setStreamingMessage("");
    setIsStreaming(false);
  };

  const handleError = (errorMessage: string, model: string) => {
    setMessages((prev) => ({
      ...prev,
      [model]: [
        ...prev[model],
        {
          role: model === Models.CHATGPT ? "system" : "assistant",
          content: [{ type: "text", text: errorMessage }],
        },
      ],
    }));
    setIsStreaming(false);
  };

  // Function to reset all context values
  const resetContext = () => {
    setActiveModel(null);
    setMessages({
      [Models.CHATGPT]: [],
      [Models.CLAUDE]: [],
    });
    setGptThreadId(null);
    setInput("");
    setStreamingMessage("");
    setIsStreaming(false);
    setShowToast(false);
    setPromptMessageIndex(null);
    setTestMessageIndex(null);
    setRefinementMessageIndices([]);
    setRefinementModalVisible(false);
    setGeneratedPrompt("");
  };

  return (
    <ChatContext.Provider
      value={{
        Models,
        activeModel,
        setActiveModel,
        activeModelKey,
        setActiveModelKey,
        messages,
        setMessages,
        gptThreadId,
        setGptThreadId,
        input,
        setInput,
        streamingMessage,
        setStreamingMessage,
        isStreaming,
        setIsStreaming,
        showToast,
        setShowToast,
        promptMessageIndex,
        setPromptMessageIndex,
        testMessageIndex,
        setTestMessageIndex,
        refinementMessageIndices,
        setRefinementMessageIndices,
        isRefinementModalVisible,
        setRefinementModalVisible,
        generatedPrompt,
        setGeneratedPrompt,
        sendMessageToModel,
        resetContext,
        promptMessageIndices,
        setPromptMessageIndices,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook for easy access to the context
export const useChatContext = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

const handlePromptDetection = (
  response: string,
  callback: (prompt: string | null) => void
) => {
  const promptStart = "PROMPT BUILT BY PROMPT GENERATOR";
  const promptEnd = "BUILT BY PROMPT GENERATOR FOR ZC EMPLOYEE";

  if (response.includes(promptStart) && response.includes(promptEnd)) {
    const prompt = response
      .split(promptStart)[1]
      ?.split(promptEnd)[0]
      ?.trim();
    if (prompt) callback(prompt);
  } else {
    callback(null);
  }
};
