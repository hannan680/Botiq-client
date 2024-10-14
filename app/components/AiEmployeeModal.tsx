"use client";

import { useState } from "react";
import { InitialStepComponent } from "./InitialStepComponent";
// import { CreateStepComponent } from "./CreateStepComponent";
import { CreateAiEmployee } from "./CreateAiEmployee";
import { useAiEmployeesContext } from "../providers/aiEmployeesProvider";
// import { UpdateStepComponent } from "./UpdateStateComponent";

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { UpdateAiEmployee } from "./updateAiEmployee";
interface AiEmployeeModalProps {
  show: boolean;
  onClose: () => void;
 
}

export default function AiEmployeeModal({
  show,
  onClose,
}: AiEmployeeModalProps) {
  const [step, setStep] = useState<"initial" | "create" | "update" | "success">(
    "initial"
  );
  const { selectedAiEmployee,setSelectedAiEmployee, } = useAiEmployeesContext();

  if (!show) return null;
  console.log(selectedAiEmployee);

  // return (
  //   <DotLottieReact
  //     src="/lottie/bot.lottie"
  //     loop
  //     autoplay
  //   />
  // )

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center z-40 transition-opacity duration-300"
    >
      <div
        className={`bg-[#333] shadow-lg rounded-lg py-14 px-12 w-full max-w-[700px] relative transform transition-transform duration-300 ${
          show ? "translate-y-0 scale-100" : "translate-y-4 scale-95"
        }`}
      >
        {step !== "success" && (
          <>
            {step === "initial" && (
              <InitialStepComponent setStep={setStep} onClose={onClose} />
            )}
            {/* You can conditionally render the other steps like this: */}
            {step === "create" && (
              <CreateAiEmployee
                questions={selectedAiEmployee?.customFields!}
                setStep={setStep}
                prompt={selectedAiEmployee?.mainPrompt! }
                onClose={onClose}
                employeeId={selectedAiEmployee?._id!}
              />
            )}
            {step === "update" && (
              <UpdateAiEmployee setStep={setStep} onClose={onClose}  />
            )}
          </>
        )}

        {step === "success" && (
          <SuccessMessage onClose={onClose} />
        )}
      </div>
    </div>
  );
}

// Separated Success Message Component for clarity
const SuccessMessage = ({ onClose }: { onClose: () => void }) => (
  <div className="text-center">
    <div className="h-72">
      <DotLottieReact src="/lottie/success.lottie" loop autoplay />
    </div>
    <p className="text-white mb-8">
      Your AI Employee has been created successfully.
    </p>
    <button
      onClick={onClose}
      className="bg-[#0081A7] text-white py-2 px-4 rounded-lg"
    >
      Go Back Home
    </button>
  </div>
);
