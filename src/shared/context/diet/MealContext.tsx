import { createContext, useContext, useState, useMemo } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";

type Meals = "breakfast" | "lunch" | "dinner";

interface MealContextType {
  meal: Meals;
  setMeal: Dispatch<SetStateAction<Meals>>;
}

const MealContext = createContext<MealContextType | null>(null);

interface MealProviderProps {
  children: ReactNode;
  initialMeal?: Meals;
}

export function MealContextProvider({
  children,
  initialMeal = "breakfast",
}: MealProviderProps) {
  const [meal, setMeal] = useState<Meals>(initialMeal);

  const value = useMemo(() => ({ meal, setMeal }), [meal]);

  return <MealContext.Provider value={value}>{children}</MealContext.Provider>;
}

export function useMeal(): MealContextType {
  const context = useContext(MealContext);
  if (context === null) {
    throw new Error("useMeal must be used within a MealContextProvider");
  }
  return context;
}
