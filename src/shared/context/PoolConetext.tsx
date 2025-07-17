const baseUrl = import.meta.env.VITE_BACKEND_URL;

import { createContext } from "react";
import { useAuth } from "./AuthContext";
import useHttp from "../hooks/useHttp";
import React, { useContext, useEffect, useState } from "react";

interface Food {
  creator: string;
  name: string;
  image: string;
  kcal: number;
  carbon: number;
  protein: number;
  fat: number;
}

type Pool = Record<string, Food> | null;

type ContextType = {
  pool: Pool;
};

const PoolContext = createContext<ContextType>({ pool: {} });

export function PoolProvider({ children }: { children: React.ReactNode }) {
  const [pool, setFoodData] = useState<Pool | null>({});
  const { token, user } = useAuth();
  const { sendRequest } = useHttp<Pool | null>();

  useEffect(() => {
    if (!user?.userId || !token) return;
    async function sendRequestHelper() {
      try {
        const responseData = await sendRequest({
          url: `${baseUrl}/basic/${user?.userId}/getPool`,
          headers: { Authorization: `Bearer ${token}` },
        });
        setFoodData(responseData);
      } catch (error) {}
    }
    sendRequestHelper();
  }, [user?.userId, token, sendRequest]);

  return (
    <PoolContext.Provider value={{ pool }}>{children}</PoolContext.Provider>
  );
}

export function usePool() {
  const context = useContext(PoolContext);
  if (!context) {
    throw new Error("usePool must be used within a PoolProvider");
  }
  return context;
}
