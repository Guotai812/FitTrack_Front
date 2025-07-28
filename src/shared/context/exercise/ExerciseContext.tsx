import type React from "react";
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

type ExerciseContextType = {
  id: string;
  setId: Dispatch<SetStateAction<string>>;
};

const ExerciseContext = createContext<ExerciseContextType | undefined>(
  undefined
);

export default function ExerciseContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [id, setId] = useState<string>("");
  return (
    <ExerciseContext.Provider value={{ id, setId }}>
      {children}
    </ExerciseContext.Provider>
  );
}

export function useExercise() {
  const context = useContext(ExerciseContext);
  if (!context) {
    throw new Error(
      "useExercise should be used within ExerciseContextProvider"
    );
  }
  return context;
}
