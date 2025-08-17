import { createContext, useContext, useState } from "react";
import type { SetStateAction, Dispatch } from "react";

type State = "manage" | "edit" | "delete" | "pool" | "add" | "upload";

type DietManageContextType = {
  state: State;
  setState: Dispatch<SetStateAction<State>>;
};

const DietManageContext = createContext<DietManageContextType>({
  state: "pool",
  setState: () => {},
});

export function DietProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>("pool");

  return (
    <DietManageContext.Provider value={{ state, setState }}>
      {children}
    </DietManageContext.Provider>
  );
}

export function useDiet() {
  const context = useContext(DietManageContext);
  if (!context) {
    throw Error("it must be used within DietProvider");
  }
  return context;
}
