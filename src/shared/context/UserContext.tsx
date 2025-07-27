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

interface AerobicItem {
  eid: string;
  duration: number;
}

interface SetItem {
  weight: number;
  reps: number;
}

interface AnaerobicItem {
  eid: string;
  sets: SetItem[];
}

interface Exercises {
  aerobic: AerobicItem[];
  anaerobic: AnaerobicItem[];
}

type MealKey = "breakfast" | "lunch" | "dinner";

type Meals = Record<MealKey, Meal>;

type Info = {
  kcal: number;
  currentKcal: number;
  weight: number;
  height: number;
  diets: Meals;
  exercises: Exercises;
  date: string;
};

type UserContextType = {
  info: Info;
  error: string | null;
  isLoading: boolean;
  updateInfo: (updated: Info) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth();
  const { error, isLoading, sendRequest } = useHttp<Info>();
  const [info, setInfo] = useState<Info>({
    currentKcal: 0,
    kcal: 0,
    weight: 0,
    height: 0,
    diets: {
      breakfast: {
        main: [{ food: "", weight: 0 }],
        extra: [{ food: "", weight: 0 }],
      },
      lunch: {
        main: [{ food: "", weight: 0 }],
        extra: [{ food: "", weight: 0 }],
      },
      dinner: {
        main: [{ food: "", weight: 0 }],
        extra: [{ food: "", weight: 0 }],
      },
    },
    exercises: {
      aerobic: [
        {
          eid: "",
          duration: 0,
        },
      ],
      anaerobic: [
        {
          eid: "",
          sets: [
            {
              weight: 0,
              reps: 0,
            },
            {
              weight: 0,
              reps: 0,
            },
            {
              weight: 0,
              reps: 0,
            },
          ],
        },
      ],
    },
    date: "",
  });

  useEffect(() => {
    if (!user?.userId || !user.isCompleted) return;
    const fetchInfo = async () => {
      try {
        const fetched = await sendRequest({
          url: `${baseUrl}/basic/${user.userId}/getDailyBasic`,
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
    <UserContext.Provider value={{ info, updateInfo, error, isLoading }}>
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
