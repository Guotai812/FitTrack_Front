import React, { createContext, useContext, useState, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";

type ProviderProps = {
  children: React.ReactNode;
};

type FoodContextType = {
  foodId: string | null;
  setFoodId: Dispatch<SetStateAction<string | null>>;
};

export const FoodContext = createContext<FoodContextType | undefined>(undefined);

export function FoodContextProvider({ children }: ProviderProps) {
  const [foodId, setFoodId] = useState<string | null>(null);
  const value = useMemo(() => ({ foodId, setFoodId }), [foodId]);
  return <FoodContext.Provider value={value}>{children}</FoodContext.Provider>;
}

export function useFood() {
  const context = useContext(FoodContext);
  if (!context) {
    throw new Error("should use it within FoodContextProvider");
  }
  return context;
}
