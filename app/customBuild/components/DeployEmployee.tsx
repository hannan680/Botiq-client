"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDeployCustomEmployee } from "@/app/hooks/useDeployCustomEmployee";
import { useChatContext } from "../../providers/chatContext";
import { useUserContext } from "@/app/providers/userContext";
import LoadingOrSuccessAnimationModal from "./LoadingOrSuccessOrErrorModal";
import { Rocket } from "lucide-react";

interface DeployEmployeeProps {
  generatedPrompt: string;
}

const DeployEmployee: React.FC<DeployEmployeeProps> = ({ generatedPrompt }) => {
  const { sendMessageToModel, resetContext, setPromptMessageIndices, refinementMessageIndices, activeModel, messages } = useChatContext();
  const { userData,ssoKey } = useUserContext();
  const router = useRouter();

  const [isDeploying, setIsDeploying] = useState(false);
  const [isSuccessDeploying, setIsSuccessDeploying] = useState(false);
  const [isErrorDeploying, setIsErrorDeploying] = useState(false);

  const { mutate: deployCustomEmployee, isPending: isPendingDeploying, isSuccess: isDeployed, isError } = useDeployCustomEmployee();

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
          setPromptMessageIndices((prevIndices) => [...prevIndices, messages[activeModel!].length]);

          const updatedResponse = await sendMessageToModel(updatedPrompt);
          if (updatedResponse?.prompt) {
            prompt = updatedResponse.prompt;
          }
        }

        if (userData && userData.activeLocation) {
          const { activeLocation } = userData;
          const locationId = activeLocation;
          deployCustomEmployee(
            { locationId, generatedPrompt: prompt,ssoKey:ssoKey! },
            {
              onSuccess: () => {
                // resetContext();
                setIsSuccessDeploying(true);
                setIsDeploying(false);
              },
              onError: () => {
                setIsErrorDeploying(true);
                setIsDeploying(false);
              },
            }
          );
        } else {
          setIsErrorDeploying(true);
        }
      } catch (error) {
        setIsErrorDeploying(true);
        setIsDeploying(false);
      }
    }
  };

  return (
    <>
      <LoadingOrSuccessAnimationModal
        show={isDeploying || isDeployed || isErrorDeploying}
        loading={isDeploying}
        success={isDeployed}
        onClose={() => {
          setIsDeploying(false);
          setIsSuccessDeploying(false);
          setIsErrorDeploying(false);
        }}
        onGoBack={() => {
          router.replace("/");
        }}
        error={isErrorDeploying ? "Error deploying employee, please try later!" : null}
      />
      <button
        onClick={handleDeploy}
        className="flex items-center gap-2 ml-3 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-gray-300 transition-all"
      >
        Deploy
        <Rocket size={16}/>
      </button>
    </>
  );
};

export default DeployEmployee;
