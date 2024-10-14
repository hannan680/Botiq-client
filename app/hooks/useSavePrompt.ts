import { useMutation } from "@tanstack/react-query";

// Define the types for the save prompt request
interface SavePromptRequest {
  locationId: string;
  employeeId: string;
  answers: string[];
  prompt: string;
  customFields: string[];
}

// Define the expected response from the save prompt API
interface SavePromptResponse {
  status: string;
  message: string;
}

// Fetch function for saving the generated prompt
const saveGeneratedPrompt = async (data: SavePromptRequest): Promise<SavePromptResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/prompt/${data.locationId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to save generated prompt");
  }

  return await response.json();
};

// React Query hook for saving the generated prompt
export const useSavePrompt = () => {
  return useMutation<SavePromptResponse, Error, SavePromptRequest>({
    mutationFn:saveGeneratedPrompt});
};
