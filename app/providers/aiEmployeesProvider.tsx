'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePublishedAiEmployees } from '../hooks/useAiEmployee'; // Import the existing hook

import { AiEmployee } from '../interfaces/aiEmployeeInterface';

// Define the shape of our context
interface AiEmployeesContextType {
  aiEmployees: AiEmployee[];
  setAiEmployees: React.Dispatch<React.SetStateAction<AiEmployee[]>>;
  selectedAiEmployee :AiEmployee | null,
  setSelectedAiEmployee:React.Dispatch<React.SetStateAction<AiEmployee | null>>,
  isLoading: boolean;
  error: Error | null;
}

// Create the context
const AiEmployeesContext = createContext<AiEmployeesContextType | undefined>(undefined);

// Create a provider component
export const AiEmployeesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [aiEmployees, setAiEmployees] = useState<AiEmployee[]>([]);
  const [selectedAiEmployee,setSelectedAiEmployee]=useState<AiEmployee | null>(null);
  const { data, isFetching:isLoading, error } = usePublishedAiEmployees();

  useEffect(() => {
    if (data && data.data) {
        console.log(data.data)
      setAiEmployees(data.data);
    }
  }, [data]);

  const value = {
    aiEmployees,
    setAiEmployees,
    selectedAiEmployee,
    setSelectedAiEmployee,
    isLoading,
    error: error as Error | null,
  };

  return (
    <AiEmployeesContext.Provider value={value}>
      {children}
    </AiEmployeesContext.Provider>
  );
};

// Create a custom hook to use the context
export const useAiEmployeesContext = () => {
  const context = useContext(AiEmployeesContext);
  if (context === undefined) {
    throw new Error('useAiEmployeesContext must be used within an AiEmployeesProvider');
  }
  return context;
};