import React, { createContext, useContext, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

type Category =
  | "all"
  | "staple"
  | "dairy"
  | "protein"
  | "vege"
  | "nut"
  | "oil"
  | "others";

type ContextType = {
  category: Category;
  setCategory: Dispatch<SetStateAction<Category>>;
};

const CategoryContext = createContext<ContextType>({
  category: "all",
  setCategory: () => {},
});

export function CategoryContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [category, setCategory] = useState<Category>("all");

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
