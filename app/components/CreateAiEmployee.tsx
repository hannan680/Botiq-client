"use client";

import { useState } from "react";
import { useSavePrompt } from "../hooks/useSavePrompt"; 
import { useUserContext } from "../providers/userContext";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
// import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// Define the types for the component props
interface CreateAiEmployeeProps {
  questions: string[];
  setStep: (step: "initial" | "create" | "update" | "success") => void;
  onClose: () => void;
  prompt: string;
  employeeId: string;
}

export function CreateAiEmployee({
  questions,
  setStep,
  onClose,
  prompt,
  employeeId,
}: CreateAiEmployeeProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string>("");
  const { mutate: savePrompt, isPending: isSaving } = useSavePrompt(); // Use the save prompt hook
  const { userData } = useUserContext();
  const { activeLocation } = userData!;
console.log(employeeId,"employeeid")
  // Handle change in the answer input
  const handleAnswerChange = (index: number, value: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);

    const updatedErrors = [...errors];
    // Clear the error for this specific index
    updatedErrors[index] = ""; 
    setErrors(updatedErrors);
};

// Validate the current set of answers
const validateAnswers = (): boolean => {
    console.log("in validate")
    console.log(errors)
    
    const newErrors = [...errors];
    const currentQuestions = questions.slice(currentIndex, currentIndex + 2);

    // Initialize error count
    let hasError = false;

    currentQuestions.forEach((_, index) => {
      const answerIndex = currentIndex + index; // Calculate the correct answer index
      if (!answers[answerIndex]) {
        newErrors[answerIndex] = "This field is required"; // Set error message
        hasError = true; // Mark that an error exists
      }
    });

    setErrors(newErrors);
    console.log(newErrors);

    // Return true only if no errors were found
    return !hasError; // Return true if no errors exist
};


  

  // Handle the next step logic, including validation and submission
  const handleNext = () => {
    console.log("first")

    if (validateAnswers()) {
        console.log("validated");
      if (currentIndex + 2 < questions.length) {
        setCurrentIndex(currentIndex + 2);
      } else {
      
        // Prepare data to save
        const promptData = {
          locationId: activeLocation!,
          employeeId:employeeId , 
          answers,
          prompt,
          customFields: questions 
        };

        // Save the generated prompt
        savePrompt(promptData, {
          onSuccess: () => {
            setAnswers([]); // Clear answers
            setCurrentIndex(0); // Reset index
            setStep("success"); // Move to success step
          },
          onError: (error) => {
            console.error("Error:", error);
            setSubmitError("Failed to submit the prompt. Please try again.");
          },
        });
      }
    }
  };

  if(isSaving){
    return (
      <div>
        <DotLottieReact 
       src="/lottie/bot.lottie"
       loop
       autoplay
    />
    <h4 className="text-white text-center">Ai Employee is in process...</h4>
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Create New AI Employee</h2>
        <button
          onClick={() => setStep("initial")}
          className="text-[#1FE2F9] hover:text-[#1FE2F9]/75  transition-colors duration-200"
        >
          &#x2190; Back
        </button>
      </div>
      {submitError && <div className="text-red-500 mb-4">{submitError}</div>}
      <div className="mb-6">
        {questions
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
          className="bg-[#0081A7] hover:bg-[#0081A7]/75 text-white py-2 px-4 rounded-lg ml-auto transition-colors duration-200 "
        //   disabled={isSaving} // Disable the button if saving
        >
          {currentIndex + 2 < questions.length ? "Next" : "Submit"}
        </button>
      </div>
    </>
  );
}
