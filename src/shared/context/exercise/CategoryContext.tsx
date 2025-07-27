import React, { createContext, useContext, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

type TopCategory = "all" | "aerobic" | "anaerobic";
type SubCategory = string;
type Category = {
  top: TopCategory;
  sub: SubCategory | null;
};

type ContextType = {
  category: Category;
  setCategory: Dispatch<SetStateAction<Category>>;
};

const CategoryContext = createContext<ContextType | undefined>(undefined);

export function CategoryContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [category, setCategory] = useState<Category>({ top: "all", sub: null });

  return (
    <CategoryContext.Provider value={{ category, setCategory }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategory() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error(
      "should use category context within CategoryContextProvider"
    );
  }
  return context;
}
