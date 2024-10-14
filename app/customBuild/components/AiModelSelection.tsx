import React from 'react';
import { useChatContext } from '../../providers/chatContext';
import ChatGptIcon from "@/public/icons/chatgpt-icon.svg"
import ClaudeIcon from "@/public/icons/claude-ai-icon.svg"
import GeminiIcon from "@/public/icons/google-gemini-icon.svg"
import ModelCard from "./AiModelCard"
import { Russo_One } from 'next/font/google';

const russoOne = Russo_One({
  subsets: ['latin'], 
  weight: '400', 
})
const AiModalSelection: React.FC = () => {
  const { Models, setActiveModel } = useChatContext();

  const handleModelSelection = (model: string): void => {
    setActiveModel(model);
  };

  return (
    <div className="flex flex-col items-center w-full justify-center min-h-screen bg-gray-50">
      <h1 className={`text-2xl font-light mb-12 text-gray-800 ${russoOne.className}`}>Welcome to Prompt Generator</h1>
      <div className="flex flex-wrap justify-center gap-8">
        <ModelCard
          name="Chat GPT"
          icon={ChatGptIcon}
          onClick={() => handleModelSelection(Models.CHATGPT)}
        />
        <ModelCard
          name="Claude"
          icon={ClaudeIcon}
          onClick={() => handleModelSelection(Models.CLAUDE)}
        />
        <ModelCard
          name="Gemini"
          icon={GeminiIcon}
          comingSoon
        />
      </div>
    </div>
  );
};

export default AiModalSelection;