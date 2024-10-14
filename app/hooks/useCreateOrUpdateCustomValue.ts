import { useMutation } from "@tanstack/react-query";

// Define the types for the parameters
interface CreateOrUpdateCustomValueParams {
  locationId: string; // Assuming locationId is a string
  name: string;       // The name of the custom value
  value: any;        // You might want to specify a more precise type here based on your application's needs
  ssoKey:string;
}

// Define the type for the response
interface CustomValueResponse {
  success: boolean; // Assuming the response has a success field
  data: any;       // Adjust this type based on the actual data structure returned
}

const createOrUpdateCustomValue = async ({
  locationId,
  name,
  value,
  ssoKey
}: CreateOrUpdateCustomValueParams): Promise<CustomValueResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/customValue/createOrUpdate/${locationId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        value: value,
        ssoKey:ssoKey,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create or update custom value");
  }

  return response.json();
};

export const useCreateOrUpdateCustomValue = () => {
  return useMutation<CustomValueResponse, Error, CreateOrUpdateCustomValueParams>({    
    mutationFn: createOrUpdateCustomValue,
  });
};
