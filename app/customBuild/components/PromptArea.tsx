"use client";

import React, { useState } from "react";
import { useChatContext } from "../../providers/chatContext";
import { AiOutlineInfoCircle } from "react-icons/ai";
import Markdown from "react-markdown";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeployCustomEmployee } from "@/app/hooks/useDeployCustomEmployee";
import { useUserContext } from "@/app/providers/userContext";
import LoadingOrSuccessAnimationModal from "./LoadingOrSuccessOrErrorModal";
import DeployEmployee from "./DeployEmployee";
import { FlaskConical } from "lucide-react";

export const PromptArea: React.FC = () => {
  const {    
    activeModel,
    sendMessageToModel,
    setTestMessageIndex,
    messages,
    generatedPrompt,
    resetContext,
    setPromptMessageIndices,
    refinementMessageIndices
   
     } = useChatContext();

     const {userData} = useUserContext();

     const router=useRouter()

     
  const [isDeploying, setIsDeploying] = useState(false);
  const [isSuccessDeploying, setIsSuccessDeploying] = useState(false);
  const [isErrorDeploying, setIsErrorDeploying] = useState(false);

  const { mutate:deployCustomEmployee, isPending:isPendingDeploying, isSuccess:isDeployed, isError, error } = useDeployCustomEmployee();


  const handleTestClick = async () => {
      router.push("/customBuild/test-prompt");
      const testMessage = {
        role: "user",
        content: [
          {
            type: "text",
            text: "Let's test the generated prompt. You act as the chatbot, I will act as a customer. You send the first message and don't reveal that you are AI until someone wants to refine the prompt.",
          },
        ],
      };
      await setTestMessageIndex(messages[activeModel!].length);
      sendMessageToModel(testMessage);
  };

  
const handleDeploy = async () => {
  if (generatedPrompt !== "") {
    let prompt = generatedPrompt;
    setIsDeploying(true);
    try {
      if (refinementMessageIndices.length !== 0) {
        const updatedPrompt = {
          role: "user",
          content: [
            {
              type: "text",
              text: "Based on the refinements, give me an updated prompt",
            },
          ],
        };
        setPromptMessageIndices((prevIndices) => [
          ...prevIndices,
          messages[activeModel!].length,
        ]);

        const updatedResponse = await sendMessageToModel(updatedPrompt);
        console.log(updatedResponse);
        console.log(prompt);
        if (
          updatedResponse?.prompt !== null &&
          updatedResponse?.prompt !== undefined
        ) {
          prompt = updatedResponse.prompt;
        }
      }
      // Proceed with deployment
      if (userData && userData.activeLocation) {
        const { activeLocation } = userData;
        const locationId = activeLocation;
        deployCustomEmployee(
          {
            locationId,
            generatedPrompt: prompt,
          },
          {
            onSuccess: () => {
              resetContext();
              setIsSuccessDeploying(true);
              setIsDeploying(false);
            },
            onError: (error) => {
              setIsErrorDeploying(true);
              setIsDeploying(false);
            },
          }
        );
      }else{
        setIsErrorDeploying(true);
      }
    } catch (error) {
      setIsErrorDeploying(true);
      setIsDeploying(false);
    }
  }
};

  return (
    <div className="flex-1 flex flex-col bg-white border border-gray-300 shadow-md rounded-lg">
     {generatedPrompt && <div className="border-t p-5 bg-gray-50 rounded-b-lg flex items-center justify-end">
        <button onClick={handleTestClick} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all">
         Test <FlaskConical size={16}/>
        </button>
        {/* <button onClick={handleDeploy} className="ml-3 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all">
          Deploy
        </button> */}
        <DeployEmployee generatedPrompt={generatedPrompt} />
      </div>}

      {/* Card Content */}
      <div className="flex-1 p-6 h-[calc(100vh-250px)]  overflow-y-auto">
        {generatedPrompt ? (
          <div className="bg-gray-50 p-6 rounded-md shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Your Generated Prompt:
            </h2>
            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm transition-all hover:shadow-md">
              <Markdown className="prose">{generatedPrompt}</Markdown>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <AiOutlineInfoCircle className="text-7xl text-gray-400 mb-4 animate-pulse" />
            <p className="text-gray-600 text-lg font-semibold">
              No prompt generated yet.
            </p>
            <p className="text-gray-500">
              Click on "Generate Prompt" to get started.
            </p>
          </div>
        )}
      </div>

     
    </div>
  );
};
