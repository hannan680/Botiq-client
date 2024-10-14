"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// Define the props interface
interface LoadingOrSuccessAnimationModalProps {
  show: boolean;        // Controls visibility of the modal
  loading: boolean;     // Indicates if loading animation should be shown
  success: boolean;  
  error:string|null;   // Indicates if success animation should be shown
  onGoBack: () => void;  // Callback function to close the modal
  onClose: () => void;  // Callback function to close the modal
}

const LoadingOrSuccessAnimationModal: React.FC<LoadingOrSuccessAnimationModalProps> = ({
  show,
  loading,
  success,
  onGoBack,
  error
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center z-40">
      <div className="bg-[#fff] rounded-lg py-14 px-12 w-full max-w-[700px] relative">
        {loading && (
          <div className="text-center">
            <div className="h-72">
              <DotLottieReact
                src="/lottie/bot.lottie"
                loop={false}
                autoplay
                speed={0.3}
              />
            </div>
            <p className="text-black mb-8">
              Please Wait, Integrating this prompt into your Custom Value
            </p>
          </div>
        )}
        {success && (
          <div className="text-center">
            <div className="h-72">
              <DotLottieReact
                src="/lottie/success.lottie"
                loop={false}
                autoplay
                speed={0.3}
              />
            </div>
            <p className="text-black mb-8">
              Your prompt has been successfully added to the Custom Value
            </p>
            <button
              onClick={onGoBack}
                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-200"
            >
              Go Back Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingOrSuccessAnimationModal;
