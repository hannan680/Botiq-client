"use client";
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { useDecryptSso } from "../hooks/useDecryptSso";

interface UserData {
  companyId: string;
  userId: string;
  userName: string;
  email: string;
  role: string;
  type: string;
  activeLocation?: string;
}

interface UserContextType {
  ssoKey:string | null,
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
  getUserData: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [ssoKey, setSsoKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { data: decryptedSsoData, refetch: refetchDecryptSso, isLoading: isDecrypting,isError } = useDecryptSso(ssoKey);

  const getUserData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const key = await new Promise<string>((resolve, reject) => {
        const handleMessage = ({ data }: MessageEvent) => {
          if (data.message === "REQUEST_USER_DATA_RESPONSE") {
            window.removeEventListener("message", handleMessage);
            resolve(data.payload);
          }
        };

        window.addEventListener("message", handleMessage);
        window.parent.postMessage({ message: "REQUEST_USER_DATA" }, "*");
      });
      setSsoKey(key);
    } catch (error) {
      console.error("Failed to get user data:", error);
      setError(error instanceof Error ? error : new Error("An unknown error occurred"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ssoKey) {
      refetchDecryptSso();
    }
  }, [ssoKey, refetchDecryptSso]);

  useEffect(()=>{
    if(isError){
      setError(new Error("An unknown error occurred"))
    }
  },[isError])

  useEffect(() => {
    if (decryptedSsoData) {
      try {
        setUserData(decryptedSsoData as UserData);
      } catch (error) {
        console.error("Failed to parse decrypted SSO data:", error);
        setError(new Error("Failed to parse user data"));
      }
    }
  }, [decryptedSsoData]);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  return (
    <UserContext.Provider value={{ 
      ssoKey,
      userData, 
      setUserData, 
      getUserData,    
      isLoading: isLoading || isDecrypting, 
      error 
      
    }}>
      {children}
    </UserContext.Provider>
  );
};