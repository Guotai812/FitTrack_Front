const baseUrl = import.meta.env.VITE_BACKEND_URL;

import React, { useEffect, useState, createContext, useContext } from "react";
import useHttp from "../hooks/useHttp";
import { useAuth } from "./AuthContext";

interface FoodItem {
  food: string;
  weight: number; // in grams
}

interface Meal {
  main: FoodItem[];
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
  updateInfo: (updated: Info) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth();
  const { sendRequest, error } = useHttp<Info>();
  const [info, setInfo] = useState<Info>({
    kcal: 0,
    weight: 0,
    height: 0,
    diets: {
      breakfast: {
        extra: [{ food: "", weight: 0 }],
        main: [{ food: "", weight: 0 }],
      },
      lunch: {
        extra: [{ food: "", weight: 0 }],
        main: [{ food: "", weight: 0 }],
      },
      dinner: {
        extra: [{ food: "", weight: 0 }],
        main: [{ food: "", weight: 0 }],
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
      } catch (err) {}
    };
    fetchInfo();
  }, [user?.userId, user?.isCompleted]);

  function updateInfo(updated: Info) {
    setInfo(updated);
  }

  return (
    <UserContext.Provider value={{ info, updateInfo }}>
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
