import React, {
  createContext,
  useState,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";

type IdxType = {
  idx: number;
  type: "aerobic" | "anaerobic";
};

type IdxContextType = {
  idx: IdxType;
  setIdx: Dispatch<SetStateAction<IdxType>>;
};

const IdxContext = createContext<IdxContextType | undefined>(undefined);

export function IdxContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [idx, setIdx] = useState<IdxType>({
    idx: 0,
    type: "aerobic",
  });
  return (
    <IdxContext.Provider value={{ idx, setIdx }}>
      {children}
    </IdxContext.Provider>
  );
}

export function useIdx() {
  const context = useContext(IdxContext);
  if (!context) {
    throw new Error("useIdx should be used within IdxContextProvider");
  }
  return context;
}
