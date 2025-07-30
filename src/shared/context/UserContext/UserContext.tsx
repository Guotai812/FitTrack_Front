const baseUrl = import.meta.env.VITE_BACKEND_URL;

import type { Info } from "./UserContextType";
import React, { useEffect, useState, createContext, useContext } from "react";
import useHttp from "../../hooks/useHttp";
import { useAuth } from "../AuthContext";

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
              sets: 0,
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
    setInfo((pre) => ({ ...pre, ...updated }));
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
