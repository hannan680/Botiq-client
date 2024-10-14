import { useQuery } from "@tanstack/react-query";

// Define the type for the generated prompt and the expected API response
interface GeneratedPrompt {
  locationId: string;
  aiEmployee: string; // Adjust the type based on your actual AI Employee model
  answers: string[];
  generatedPrompt: string;
  prompt: string;
  customFields: string[];
}

interface GeneratedPromptResponse {
  status: string;
  data: {
    generatedPrompt: GeneratedPrompt;
  };
}

// Fetch function for getting the generated prompt
const fetchGeneratedPrompt = async (locationId: string): Promise<GeneratedPromptResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/prompt/${locationId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch generated prompt");
  }

  return await response.json();
};

// React Query hook for getting the generated prompt
export const useGetGeneratedPrompt = (locationId: string) => {
  return useQuery<GeneratedPromptResponse>({
    queryKey: ["generatedPrompt", locationId],
    queryFn: () => fetchGeneratedPrompt(locationId),
    enabled: !!locationId,
  });
};
