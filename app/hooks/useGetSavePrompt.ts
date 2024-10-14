import { useQuery } from "@tanstack/react-query";

// Define the expected response from the get generated prompt API
interface GeneratedPromptResponse {
  status: string;
  data: {
    generatedPrompt: {
      _id: string;
      locationId: string;
      aiEmployee: string; 
      answers: string[];  // Array of answers
      generatedPrompt: string; // The generated prompt
      prompt: string; // Prompt used for generation
      customFields: string[]; // Custom fields for the employee
      createdAt: Date; // Date created
      updatedAt: Date; // Date updated
    };
  };
}

// Fetch function for getting the generated prompt
const fetchGeneratedPrompt = async (locationId: string): Promise<GeneratedPromptResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/prompt/${locationId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json(); // Capture error response if any
    throw new Error(errorData.message || "Failed to fetch generated prompt");
  }

  return await response.json();
};

// Custom React Query hook for getting the generated prompt
export const useGetGeneratedPrompt = (locationId: string) => {
  return useQuery<GeneratedPromptResponse>({
    queryKey: ["generatedPrompt", locationId],
    queryFn: () => fetchGeneratedPrompt(locationId),
    enabled: !!locationId, // Only run the query if locationId is provided
  });
};
