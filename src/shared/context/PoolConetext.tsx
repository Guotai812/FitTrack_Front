const baseUrl = import.meta.env.VITE_BACKEND_URL;

import { createContext } from "react";
import { useAuth } from "./AuthContext";
import useHttp from "../hooks/useHttp";
import React, { useContext, useEffect, useState } from "react";

interface Food {
  _id: string;
  creator: string;
  name: string;
  image: string;
  kcal: number;
  carbon: number;
  protein: number;
  fat: number;
  type: string;
}

export interface Exercise {
  _id: string;
  creator: string;
  isPublic: boolean;
  name: string;
  image: string;
  type: "aerobic" | "anaerobic";
  subType: string;
  // cardio fields
  met: number | null;
  kcalPerHour: number | null;
  // strength fields
  defaultRom: number | null;
  efficiency: number;
  buffer: number;
  // pre-computed multiplier
  kcalPerKgMeter: number;
}

interface PoolResponse {
  foods: Pool;
  exercises: Epool;
}

type Pool = Record<string, Food>;
type Epool = Record<string, Exercise>;

type ContextType = {
  pool: Pool;
  ePool: Epool;
};

const PoolContext = createContext<ContextType>({ pool: {}, ePool: {} });

export function PoolProvider({ children }: { children: React.ReactNode }) {
  const [pool, setFoodData] = useState<Pool>({});
  const [ePool, setEPool] = useState<Epool>({});
  const { token, user } = useAuth();
  const { sendRequest } = useHttp<PoolResponse>();

  useEffect(() => {
    if (!user?.userId || !token) return;
    async function sendRequestHelper() {
      try {
        const { foods, exercises } = await sendRequest({
          url: `${baseUrl}/basic/${user?.userId}/getPool`,
          headers: { Authorization: `Bearer ${token}` },
        });
        setFoodData(foods);
        setEPool(exercises);
      } catch (error) {}
    }
    sendRequestHelper();
  }, [user?.userId, token]);

  return (
    <PoolContext.Provider value={{ pool, ePool }}>
      {children}
    </PoolContext.Provider>
  );
}

export function usePool() {
  const context = useContext(PoolContext);
  if (!context) {
    throw new Error("usePool must be used within a PoolProvider");
  }
  return context;
}
