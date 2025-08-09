import React, {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

type DateContext = {
  date: { year: number; month: number };
  setDate: Dispatch<SetStateAction<{ year: number; month: number }>>;
};

const dateContext = createContext<DateContext | undefined>(undefined);

export function DateContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [date, setDate] = useState<{ year: number; month: number }>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });
  return (
    <dateContext.Provider value={{ date, setDate }}>
      {children}
    </dateContext.Provider>
  );
}

export function useDate() {
  const context = useContext(dateContext);
  if (!context) {
    throw new Error("useDate must be used within an DateContextProvider");
  }
  return context;
}
