// hooks/useGetCategories.ts
import { useQuery } from "@tanstack/react-query";

interface Category {
  _id: string;
  name: string;
  description?: string;
}

interface CategoriesResponse {
  data: Category[];
}

// Fetch function to get categories
const fetchCategories = async (): Promise<CategoriesResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/aiCategories`); // Adjust the endpoint as necessary
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return await response.json();
};

// Custom hook for fetching categories
export const useGetCategories = () => {
  return useQuery<CategoriesResponse>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
};
