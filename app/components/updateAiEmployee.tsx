"use client";

import { useState, useEffect } from "react";
import { useSavePrompt } from "../hooks/useSavePrompt"; 
import { useUserContext } from "../providers/userContext";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useGetGeneratedPrompt } from "../hooks/useGetGeneratedPrompt";

// Define the types for the component props
interface UpdateAiEmployeeProps {
  setStep: (step: "initial" | "create" | "update" | "success") => void;
  onClose: () => void;
}

export function UpdateAiEmployee({
  setStep,
  onClose,
}: UpdateAiEmployeeProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string>("");
  const { mutate: savePrompt, isPending: isSaving } = useSavePrompt();
  const { userData } = useUserContext();
  const { activeLocation } = userData!;

  // Use the custom hook to fetch the generated prompt
  const { data: promptData, isLoading } = useGetGeneratedPrompt(userData?.activeLocation!);

  useEffect(() => {
    if (promptData) {
      const { answers: fetchedAnswers, prompt, customFields } = promptData.data.generatedPrompt;
      setAnswers(fetchedAnswers);
      setErrors(new Array(fetchedAnswers.length).fill(""));
      // Initialize other fields if needed
    }
  }, [promptData]);

  // Handle change in the answer input
  const handleAnswerChange = (index: number, value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);

    const updatedErrors = [...errors];
    updatedErrors[index] = ""; // Clear the error for this specific index
    setErrors(updatedErrors);
  };

  // Validate the current set of answers
  const validateAnswers = (): boolean => {
    const newErrors = [...errors];
    const currentQuestions = promptData?.data.generatedPrompt.customFields.slice(currentIndex, currentIndex + 2);

    let hasError = false;

    currentQuestions?.forEach((_, index) => {
      const answerIndex = currentIndex + index;
      if (!answers[answerIndex]) {
        newErrors[answerIndex] = "This field is required"; 
        hasError = true;
      }
    });

    setErrors(newErrors);
    return !hasError; 
  };

  // Handle the next step logic, including validation and submission
  const handleNext = () => {
    if (validateAnswers()) {
      if (currentIndex + 2 < promptData?.data.generatedPrompt.customFields.length!) {
        setCurrentIndex(currentIndex + 2);
      } else {
        // Prepare data to save
        const promptDataToSave = {
          locationId: activeLocation!,
          employeeId: promptData?.data.generatedPrompt.aiEmployee!, 
          answers,
          prompt: promptData?.data.generatedPrompt.prompt!,
          customFields: promptData?.data.generatedPrompt.customFields!,
        };

        // Save the generated prompt
        savePrompt(promptDataToSave, {
          onSuccess: () => {
            setAnswers([]);
            setCurrentIndex(0);
            setStep("success");
          },
          onError: (error) => {
            console.error("Error:", error);
            setSubmitError("Failed to submit the prompt. Please try again.");
          },
        });
      }
    }
  };

  if (isLoading || isSaving) {
    return (
      <div>
        <DotLottieReact 
          src="/lottie/bot.lottie"
          loop
          autoplay
        />
        <h4 className="text-white text-center">{isSaving ? "Ai Employee is updating..." :"Getting Data..."} </h4>
      </div>
    );
  }
  console.log(promptData)

  if(answers.length === 0){
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Update AI Employee</h2>
        <button
          onClick={() => setStep("initial")}
          className="text-[#1FE2F9] hover:text-[#1FE2F9]/75 transition-colors duration-200"
        >
          &#x2190; Back
        </button>
           </div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl  text-white">Nothing to update</h2>
          </div>
      </div>
        )
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Update AI Employee</h2>
        <button
          onClick={() => setStep("initial")}
          className="text-[#1FE2F9] hover:text-[#1FE2F9]/75 transition-colors duration-200"
        >
          &#x2190; Back
        </button>
      </div>
      {submitError && <div className="text-red-500 mb-4">{submitError}</div>}
      <div className="mb-6">
        {promptData?.data.generatedPrompt.customFields
          .slice(currentIndex, currentIndex + 2)
          .map((question, index) => (
            <div key={index} className="mb-4">
              <label className="block text-white mb-2">{question}</label>
              <input
                type="text"
                value={answers[currentIndex + index] || ""}
                onChange={(e) => handleAnswerChange(currentIndex + index, e.target.value)}
                className={`w-full p-2 border border-gray-300 rounded-lg ${
                  errors[currentIndex + index] ? "border-red-500" : ""
                } bg-[#2A2A2B] text-white transition-colors duration-200`}
              />
              {errors[currentIndex + index] && (
                <p className="text-red-500 text-sm mt-1">{errors[currentIndex + index]}</p>
              )}
            </div>
          ))}
      </div>
      <div className="flex justify-between">
        {currentIndex > 0 && (
          <button
            onClick={() => setCurrentIndex(currentIndex - 2)}
            className="bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 hover:bg-gray-500"
          >
            Previous
          </button>
        )}
        <button
          onClick={handleNext}
          className="bg-[#0081A7] hover:bg-[#0081A7]/75 text-white py-2 px-4 rounded-lg ml-auto transition-colors duration-200"
        >
          {currentIndex + 2 < promptData?.data.generatedPrompt.customFields.length! ? "Next" : "Submit"}
        </button>
      </div>
    </>
  );
}
