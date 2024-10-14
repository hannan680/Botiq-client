import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AiEmployee } from '../interfaces/aiEmployeeInterface';

// Define your API base URL and API key
const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL as string;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY as string;

// Define the headers for the API requests
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${API_KEY}`,
};

// Type definitions for AI Employee

// Type definitions for the response
interface ApiResponse<T> {
  status: string;
  results?: number;
  totalCount?: number;
  data: T;
}

// Error handling function
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "An error occurred");
  }
  return response.json();
};

// API fetch functions
const fetchAiEmployees = () =>
  fetch(`${API_BASE_URL}/aiEmployees`, { headers }).then(handleResponse) as Promise<ApiResponse<AiEmployee[]>>;

const fetchPublishedAiEmployees = (page: number, limit: number) =>
  fetch(`${API_BASE_URL}/aiEmployees/published`, { headers })
    .then(handleResponse) as Promise<ApiResponse<AiEmployee[]>>;
const fetchDraftAiEmployees = () =>
  fetch(`${API_BASE_URL}/aiEmployees/draft`, { headers }).then(handleResponse) as Promise<ApiResponse<AiEmployee[]>>;

const fetchAiEmployeeById = (id: string) =>
  fetch(`${API_BASE_URL}/aiEmployees/${id}`, { headers }).then(handleResponse) as Promise<ApiResponse<AiEmployee>>;

const fetchAiEmployeesByCategory = (categoryId: string, page: number, limit: number) =>
  fetch(`${API_BASE_URL}/aiEmployees/category/${categoryId}`, { headers })
    .then(handleResponse) as Promise<ApiResponse<AiEmployee[]>>;


const createAiEmployee = (employeeData: Partial<AiEmployee>) =>
  fetch(`${API_BASE_URL}/aiEmployees`, {
    method: "POST",
    headers,
    body: JSON.stringify(employeeData),
  }).then(handleResponse) as Promise<ApiResponse<AiEmployee>>;

const updateAiEmployee = ({ id, ...updateData }: { id: string } & Partial<AiEmployee>) =>
  fetch(`${API_BASE_URL}/aiEmployees/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(updateData),
  }).then(handleResponse) as Promise<ApiResponse<AiEmployee>>;

const deleteAiEmployee = (id: string) =>
  fetch(`${API_BASE_URL}/aiEmployees/${id}`, {
    method: "DELETE",
    headers,
  }).then(handleResponse) as Promise<ApiResponse<void>>;

// Custom hooks
export const useAiEmployees = () => {
  return useQuery<ApiResponse<AiEmployee[]>>({
    queryKey: ["aiEmployees"],
    queryFn: fetchAiEmployees,
  });
};

export const usePublishedAiEmployees = (page = 1, limit = 9) => {
  return useQuery<ApiResponse<AiEmployee[]>>({
    queryKey: ["aiEmployees", "published", page, limit],
    queryFn: () => fetchPublishedAiEmployees(page, limit),
  });
};

export const useAiEmployeesByCategory = (categoryId: string, page = 1, limit = 9) => {
  return useQuery<ApiResponse<AiEmployee[]>, Error>({
    queryKey: ["aiEmployees", "category", categoryId, page, limit],
    queryFn: () => fetchAiEmployeesByCategory(categoryId, page, limit),
    enabled: !!categoryId, // Only run the query if categoryId is provided
  });
};


export const useDraftAiEmployees = () => {
  return useQuery<ApiResponse<AiEmployee[]>>({
    queryKey: ["aiEmployees", "draft"],
    queryFn: fetchDraftAiEmployees,
  });
};

export const useCreateAiEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<AiEmployee>, Error, Partial<AiEmployee>>({
    mutationFn: createAiEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aiEmployees"] }); // Updated to new syntax
    },
  });
};

export const useUpdateAiEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<AiEmployee>, Error, { id: string } & Partial<AiEmployee>>({
    mutationFn: updateAiEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aiEmployees"] }); // Updated to new syntax
    },
  });
};

export const useDeleteAiEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, Error, string>({
    mutationFn: deleteAiEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aiEmployees"] }); // Updated to new syntax
    },
  });
};

export const useGetAiEmployeeById = (id: string) => {
  return useQuery<ApiResponse<AiEmployee>, Error>({
    queryKey: ["aiEmployee", id],
    queryFn: () => fetchAiEmployeeById(id),
    enabled: !!id,
  });
};
