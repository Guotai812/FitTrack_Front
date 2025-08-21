import { createContext, useContext, useState } from "react";
import type { Epool } from "./PoolConetext";

type CustomizedExContextType = {
  ePool: Epool | undefined;
  updateEpool: (newEpool: Epool) => void;
};

const CustomizedExContext = createContext<CustomizedExContextType | undefined>(
  undefined
);

export function CustomizedExContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ePool, setEpool] = useState<Epool | undefined>(undefined);

  function updateEpool(newPool: Epool) {
    setEpool((prevPool) => {
      if (!prevPool) return newPool;
      return { ...prevPool, ...newPool };
    });
  }
  return (
    <CustomizedExContext.Provider value={{ ePool, updateEpool }}>
      {children}
    </CustomizedExContext.Provider>
  );
}

export function useCustomizedExContext() {
  const context = useContext(CustomizedExContext);
  if (!context) {
    throw new Error(
      "useCustomizedExContext must be used within a CustomizedExContextProvider"
    );
  }
  return context;
}
