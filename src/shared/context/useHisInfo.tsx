const baseUrl = import.meta.env.VITE_BACKEND_URL;

import type { Info } from "./UserContext/UserContextType";
import React, { useEffect, useState, createContext, useContext } from "react";
import useHttp from "../hooks/useHttp";
import { useAuth } from "../context/AuthContext";

type UserContextType = {
  info: Info;
  error: string | null;
  isLoading: boolean;
  date: string;
  updateInfo: (updated: Info) => void;
};

const HisInfoContext = createContext<UserContextType | undefined>(undefined);

export function HisInfoProvider({
  children,
  date,
}: {
  children: React.ReactNode;
  date: string;
}) {
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
          // done: add rId
          rid: "",
          duration: 0,
        },
      ],
      anaerobic: [
        {
          eid: "",
          // done: add rId
          rid: "",
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
          url: `${baseUrl}/basic/${user.userId}/getDailyBasic?date=${date}`,
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
    <HisInfoContext.Provider
      value={{ info, updateInfo, error, isLoading, date }}
    >
      {children}
    </HisInfoContext.Provider>
  );
}

export function useHisInfo() {
  const context = useContext(HisInfoContext);
  if (!context) {
    throw new Error("useHisInfo must be used within a HisInfoProvider");
  }
  return context;
}
