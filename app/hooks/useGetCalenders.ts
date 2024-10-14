import { useQuery } from "@tanstack/react-query";
import { useUserContext } from "../providers/userContext";

// Define the types for the calendar, selected calendar, and the expected API response
interface Calendar {
  id: string;
  name: string;
}

interface CalendarsResponse {
  calendars: Calendar[];
  selectedCalendar: Calendar | null; // Include the selectedCalendar field
  traceId: string;
}

// Fetch function with type annotations
const fetchCalendars = async (locationId: string): Promise<CalendarsResponse> => {

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/calendar/?locationId=${locationId}`,{
      method:"GET",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch calendars");
  }

  return await response.json();
};

// React Query hook with typed response
export const useGetCalendars = (locationId: string) => {
  return useQuery<CalendarsResponse>({
    queryKey: ["calendars", locationId],
    queryFn: () => fetchCalendars(locationId),
    enabled: !!locationId,
  });
};
