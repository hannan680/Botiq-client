import { useMutation, UseMutationResult } from "@tanstack/react-query";

// Define types for the parameters
interface DeployCustomEmployeeParams {
  locationId: string;
  generatedPrompt: string;
  ssoKey: string;
}

// Define the response type (adjust this according to your actual API response)
interface DeployCustomEmployeeResponse {
  success: boolean;
  data: any; // Update 'any' with a more specific type if you know the structure of the response
  message?: string;
}

// The function to deploy a custom employee
const deployCustomEmployee = async ({
  locationId,
  generatedPrompt,
  ssoKey

}: DeployCustomEmployeeParams): Promise<DeployCustomEmployeeResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/customValue/createOrUpdate/${locationId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "OpenAi Prompt",
        value: generatedPrompt,
        ssoKey:ssoKey
        
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to deploy custom employee");
  }

  return response.json() as Promise<DeployCustomEmployeeResponse>;
};

// Custom hook using the useMutation hook
export const useDeployCustomEmployee = (): UseMutationResult<
  DeployCustomEmployeeResponse,
  Error, // The error type
  DeployCustomEmployeeParams // Variables passed to the mutation function
> => {
  return useMutation({
    mutationKey: ["deployCustomEmployee"], // Updated mutation key
    mutationFn: deployCustomEmployee,
  });
};
