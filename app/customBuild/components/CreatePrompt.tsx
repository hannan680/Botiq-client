

import React, { useState, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useChatContext } from '@/app/providers/chatContext';
import { useUserContext } from '@/app/providers/userContext';
import { Eye, EyeOff, SwitchCamera } from 'lucide-react';
import { useGetApiKeys, useSaveApiKey } from '../../hooks/useModelKey';
import { AiModels } from '@/app/interfaces/AiModels';

const CreatePrompt: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const { messages, sendMessageToModel, activeModel, setActiveModel, setActiveModelKey } = useChatContext();
  const {  userData } = useUserContext();
  
  const { data: apiKeysData } = useGetApiKeys(userData?.activeLocation || '');
  const saveApiKeyMutation = useSaveApiKey();

  useEffect(() => {
    if (activeModel === AiModels.CLAUDE && apiKeysData) {
      const claudeKey = apiKeysData.data.find(key => key.provider === 'CLAUDE');
      if (claudeKey) {
        setApiKey('*****************************');
        setActiveModelKey(claudeKey.id);
      } else {
        setApiKey('');
      }
    }
  }, [activeModel, apiKeysData]);

  const handleSaveApiKey = async () => {
    if (!apiKey || activeModel !== AiModels.CLAUDE || !userData?.activeLocation) return;

    try {
      await saveApiKeyMutation.mutateAsync({
        provider: 'CLAUDE',
        apiKey: apiKey,
      });
      setActiveModelKey(apiKey);
      alert('API key saved successfully!');
    } catch (error) {
      console.error('Failed to save API key:', error);
      alert('Failed to save API key. Please try again.');
    }
  };

  const handleApiKeyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const handleCreatePrompt = async () => {
    if (!activeModel) {
      alert('No active model selected');
      return;
    }
if(activeModel === AiModels.CLAUDE){

  if (!apiKeysData?.data.some(key => key.provider === 'CLAUDE')) {
    alert('No API key found for Claude');
    return;
  }
}

    const newMessage = {
      role: 'user',
      content: [{ type: 'text', text: 'Create Prompt' }],
    };

    await sendMessageToModel(newMessage);
  };

  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey);
  };

  const handleSwitchModel = () => {
    setActiveModel(null);
  };

  return (
    <div className="flex flex-col w-full items-center justify-center min-h-screen bg-white p-4 relative">
      <button
        onClick={handleSwitchModel}
        className="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
        aria-label="Switch model"
      >
        <SwitchCamera size={24} />
      </button>

      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-4xl">
        <div className="w-full md:w-1/2 mb-8 md:mb-0">
          <DotLottieReact src="/lottie/hello-bot.lottie" loop autoplay />
        </div>
        <div className="w-full md:w-1/2 md:pl-8 space-y-6">
          {activeModel === AiModels.CLAUDE && (
            <div className="space-y-2">
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                Claude API Key
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  id="apiKey"
                  placeholder="Enter your Claude API key"
                  value={apiKey}
                  onChange={handleApiKeyInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                />
                <button
                  type="button"
                  onClick={toggleApiKeyVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showApiKey ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <button
                onClick={handleSaveApiKey}
                className="mt-2 w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-300"
              >
                Save API Key
              </button>
            </div>
          )}

         

          <p className="text-gray-600">
            Create a custom prompt and watch the AI adapt to your needs. Ready to get started?
          </p>

          <button
            onClick={handleCreatePrompt}
            className="w-full bg-[#0D1F50] text-white px-6 py-2 rounded-full hover:bg-blue-900 transition-colors duration-300 font-medium"
            disabled={!activeModel || (activeModel === AiModels.CLAUDE && !apiKeysData?.data.some(key => key.provider === 'CLAUDE'))}
          >
            Create Prompt
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePrompt;