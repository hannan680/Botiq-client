import { useQuery } from "@tanstack/react-query";

interface CommonResponseData {
  companyId: string;
  email: string;
  role: string;
  type: string;
  userId: string;
  userName: string;
}

interface ResponseDataWithLocation extends CommonResponseData {
  activeLocation: string;
}

type DecryptSsoResponseData = CommonResponseData | ResponseDataWithLocation;

interface ApiResponse {
  status: string;
  data: DecryptSsoResponseData;
}

const decryptSso = async (key: string): Promise<DecryptSsoResponseData> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/decrypt-sso`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to decrypt SSO");
  }

  const apiResponse: ApiResponse = await response.json();

  if (apiResponse.status !== "success") {
    throw new Error("API response indicates failure");
  }
  
  return apiResponse.data;
};

// Custom hook to use the decrypt SSO functionality
export const useDecryptSso = (key: string | null) => {
  return useQuery<DecryptSsoResponseData, Error>({
    queryKey: ["decryptSso", key],
    queryFn: () => decryptSso(key as string),
    enabled: key !== null && key !== "", // Only fetch if key exists and is non-empty
  });
};