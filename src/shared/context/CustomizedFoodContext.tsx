import React, {
  useState,
  createContext,
  type Dispatch,
  type SetStateAction,
} from "react";

import type { Pool } from "./PoolConetext";

type cFoodContextType = {
  pool: Pool | undefined;
  setPool: Dispatch<SetStateAction<Pool | undefined>>;
};

export const cFoodContext = createContext<cFoodContextType | undefined>(
  undefined
);

export const CustomizedFoodContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [pool, setPool] = useState<Pool | undefined>(undefined);

  return (
    <cFoodContext.Provider value={{ pool, setPool }}>
      {children}
    </cFoodContext.Provider>
  );
};

export function useCustomizedFood() {
  const context = React.useContext(cFoodContext);
  if (!context) {
    throw new Error(
      "useCustomizedFood must be used within a CustomizedFoodContextProvider"
    );
  }
  return context;
}
