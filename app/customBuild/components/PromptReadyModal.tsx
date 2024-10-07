import React from "react";

interface PromptReadyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegeneratePrompt: () => void;
  onSeePrompt: () => void;
}

const PromptReadyModal: React.FC<PromptReadyModalProps> = ({
  isOpen,
  onClose,
  onRegeneratePrompt,
  onSeePrompt,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-3xl shadow-lg relative max-w-lg w-full">
        {/* Modal Close Button */}


        {/* Robot Image */}
        <div className="flex justify-center mb-6">
          <img
            src="/images/promptbot.png"
            alt="Robot Icon"
            className="h-60"
          />
        </div>

        {/* Modal Title */}
        <div className="text-center text-2xl font-bold text-gray-800 mb-4">
          Your Prompt is Ready for Testing
        </div>

        {/* Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={onRegeneratePrompt}
            className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-200 transition duration-200"
          >
            Regenerate Prompt
          </button>
          <button
            onClick={onSeePrompt}
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-200"

          >
            Inspect Prompt
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptReadyModal;
