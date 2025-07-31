import React, {
  createContext,
  useState,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";

type ItemType = {
  rid: string;
  idx: number;
  type: "aerobic" | "anaerobic";
};

type ItemContextType = {
  item: ItemType;
  setItem: Dispatch<SetStateAction<ItemType>>;
};

const ItemContext = createContext<ItemContextType | undefined>(undefined);

export function ItemContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [item, setItem] = useState<ItemType>({
    rid: "",
    idx: 0,
    type: "aerobic",
  });
  return (
    <ItemContext.Provider value={{ item, setItem }}>
      {children}
    </ItemContext.Provider>
  );
}

export function useItem() {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error("useRid should be used within RIdContextProvider");
  }
  return context;
}
