const baseUrl = import.meta.env.VITE_BACKEND_URL;

import React, { useEffect, useState, createContext, useContext } from "react";
import useHttp from "../hooks/useHttp";
import { useAuth } from "./AuthContext";

interface FoodItem {
  food: string;
  weight: number; // in grams
}

interface Meal {
  diet: FoodItem[];
  extra: FoodItem[];
}

type MealKey = "breakfast" | "lunch" | "dinner";

type Meals = Record<MealKey, Meal>;

type Info = {
  kcal: number;
  weight: number;
  height: number;
  diets: Meals;
  exercises: [];
  date: string;
};

type UserContextType = {
  info: Info;
  updateDiet: (meal: MealKey, kcal: number) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth();
  // tell useHttp what shape you'll get back
  const { sendRequest, error } = useHttp<Info>();
  const [info, setInfo] = useState<Info>({
    kcal: 0,
    weight: 0,
    height: 0,
    diets: {
      breakfast: {
        extra: [{ food: "", weight: 0 }],
        diet: [{ food: "", weight: 0 }],
      },
      lunch: {
        extra: [{ food: "", weight: 0 }],
        diet: [{ food: "", weight: 0 }],
      },
      dinner: {
        extra: [{ food: "", weight: 0 }],
        diet: [{ food: "", weight: 0 }],
      },
    },
    exercises: [],
    date: "",
  });

  useEffect(() => {
    if (!user?.userId || !user.isCompleted) return;
    const fetchInfo = async () => {
      console.log(2);
      try {
        const fetched = await sendRequest({
          url: `${baseUrl}/basic/${user.userId}`,
          headers: { Authorization: `Bearer ${token}` },
        });
        setInfo(fetched);
      } catch (err) {
        console.error("Failed to load user info:", error || err);
      }
    };

    fetchInfo();
  }, [user?.userId, user?.isCompleted]);

  // TODO: add update weight...
  function updateDiet(meal: MealKey, kcal: number) {}

  return (
    <UserContext.Provider value={{ info, updateDiet }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
