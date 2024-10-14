import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserContext } from '@/app/providers/userContext';

interface ApiKey {
  id: string;
  provider: 'CLAUDE' | 'OPENAI';
  locationId: string;
  isActive: boolean;
}

interface ApiKeyResponse {
  status: 'success';
  data: ApiKey[];
}

interface SaveApiKeyRequest {
  provider: 'CLAUDE' | 'OPENAI';
  apiKey: string;
}

interface SaveApiKeyResponse {
  status: 'success';
  data: ApiKey;
}

const fetchApiKeys = async (locationId: string, ssoKey: string): Promise<ApiKeyResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/apiKeys/?locationId=${locationId}`,
    {
      headers: {
        'Authorization': `Bearer ${ssoKey}`,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch API keys');
  }

  return await response.json();
};

const saveApiKey = async (data: SaveApiKeyRequest, ssoKey: string): Promise<SaveApiKeyResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/apiKeys`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ssoKey}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to save API key');
  }

  return await response.json();
};

export const useGetApiKeys = (locationId: string) => {
  const { ssoKey } = useUserContext();

  return useQuery<ApiKeyResponse>({
    queryKey: ['apiKeys', locationId],
    queryFn: () => fetchApiKeys(locationId, ssoKey || ''),
    enabled: !!locationId && !!ssoKey,
  });
};

export const useSaveApiKey = () => {
  const queryClient = useQueryClient();
  const { ssoKey } = useUserContext();

  return useMutation<SaveApiKeyResponse, Error, SaveApiKeyRequest>({
    mutationFn: (data) => saveApiKey(data, ssoKey || ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
    },
  });
};