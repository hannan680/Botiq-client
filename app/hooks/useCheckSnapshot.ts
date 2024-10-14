import { useQuery } from "@tanstack/react-query";
interface Workflow {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface WorkflowStatus {
  requiredName: string;
  found: boolean;
  actualWorkflow: Workflow | null;
}

interface CheckSnapshotResponse {
  status: string;
  data: {
    workflowStatus: WorkflowStatus[];
    missingWorkflows: string[];
    allWorkflowsPresent: boolean;
  };
}

// Type for the API error
interface ApiError extends Error {
  statusCode?: number;
}

// Fetch function to get workflows
const fetchWorkflows = async (locationId: string): Promise<CheckSnapshotResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/workflow/checkSnapshot?locationId=${locationId}`
  );
  
  if (!response.ok) {
    const error: ApiError = new Error("Failed to fetch workflows");
    error.statusCode = response.status;
    throw error;
  }

  return await response.json();
};

// React Query hook to check snapshot (workflows)
export const useCheckSnapshot = (locationId: string | undefined) => {
  return useQuery<CheckSnapshotResponse, ApiError>({
    queryKey: ["workflows", locationId],
    queryFn: () => locationId ? fetchWorkflows(locationId) : Promise.reject(new Error("Location ID is required")),
    enabled: !!locationId,  // Only enable query when locationId is provided
  });
};