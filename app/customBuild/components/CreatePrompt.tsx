// import React from 'react';
// import Image from 'next/image';
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// import { useChatContext } from '@/app/providers/chatContext';

// const CreatePrompt: React.FC = () => {
//     const {
//         messages,
//         sendMessageToModel,
//         activeModel,
//       } = useChatContext();
//   const handleCreatePrompt =async () => {
//     // Implement the create prompt functionality here
//     const newMessage = {
//         role: "user",
//         content: [{ type: "text", text: "Create Prompt" }],
//       };
  
//       await sendMessageToModel(newMessage);
//   };

//   return (
//     <div className="flex flex-col w-full items-center justify-center min-h-screen bg-white p-4">
//       <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-4xl">
//         <div className="w-full md:w-1/2 mb-8 md:mb-0">
//           {/* <Image
//             src="/images/bot.png" // Ensure this path is correct
//             alt="AI Bot"
//             width={400}
//             height={400}
//             layout="responsive"
//             priority
//           /> */}
//           <DotLottieReact
//           src='/lottie/hello-bot.lottie'
//         loop 
//         autoplay
    
//           />
//         </div>
//         <div className="w-full md:w-1/2 md:pl-8">
//           <p className="text-gray-600 mb-6">
//           Create a custom prompt and watch the AI adapt to your needs. Ready to get started?


//           </p>
//           <button
//             onClick={handleCreatePrompt}
//             className="bg-[#0D1F50] text-white px-6 py-2 rounded-full hover:bg-blue-900 transition-colors duration-300"
//           >
//             Create Prompt
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreatePrompt;
import React, { useState, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useChatContext } from '@/app/providers/chatContext';
import { Eye, EyeOff, SwitchCamera } from 'lucide-react';

const CreatePrompt: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isApiKeyStored, setIsApiKeyStored] = useState(false);
  const { messages, sendMessageToModel, activeModel, setActiveModel,setActiveModelKey } = useChatContext();

  // Retrieve the API key when activeModel changes
  useEffect(() => {
    if (activeModel) {
      const storedApiKey = localStorage.getItem(`apiKey_${activeModel}`);
      if (storedApiKey) {
        setApiKey(storedApiKey);
        setIsApiKeyStored(true);
        setActiveModelKey(storedApiKey);
      } else {
        setApiKey('');
        setIsApiKeyStored(false);
      }
    }
  }, [activeModel]);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);

    if (newApiKey && activeModel) {
      localStorage.setItem(`apiKey_${activeModel}`, newApiKey); // Store the actual key
      setIsApiKeyStored(true);
      setActiveModelKey(newApiKey);
    } else if (activeModel) {
      localStorage.removeItem(`apiKey_${activeModel}`);
      setIsApiKeyStored(false);
    }
  };

  const handleCreatePrompt = async () => {
    if (!activeModel) {
      alert('No active model selected');
      return;
    }

    const storedApiKey = localStorage.getItem(`apiKey_${activeModel}`);
    if (!storedApiKey) {
      alert('No API key found for the active model');
      return;
    }

    const newMessage = {
      role: 'user',
      content: [{ type: 'text', text: 'Create Prompt' }],
    };

    await sendMessageToModel(newMessage);
  };

  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey); // Toggle the visibility of the API key
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
          <div className="space-y-2">
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
              API Key ({activeModel || 'No model selected'})
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'} // Show actual key if showApiKey is true
                id="apiKey"
                placeholder="Enter your API key"
                value={apiKey} // Always show the actual API key (not masked)
                onChange={handleApiKeyChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                disabled={!activeModel}
              />
              <button
                type="button"
                onClick={toggleApiKeyVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showApiKey ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {isApiKeyStored && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <p className="text-sm text-blue-700">API key is securely stored for the {activeModel} model.</p>
            </div>
          )}

          <p className="text-gray-600">
            Create a custom prompt and watch the AI adapt to your needs. Ready to get started?
          </p>

          <button
            onClick={handleCreatePrompt}
            className="w-full bg-[#0D1F50] text-white px-6 py-2 rounded-full hover:bg-blue-900 transition-colors duration-300 font-medium"
            disabled={!activeModel}
          >
            Create Prompt
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePrompt;
