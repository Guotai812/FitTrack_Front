import { createContext, useContext, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

type EditObject = {
  foodId: string;
  meal: "breakfast" | "lunch" | "dinner";
  isMain: boolean;
};

type EditContextType = {
  edit: EditObject | undefined;
  setEdit: Dispatch<SetStateAction<EditObject | undefined>>;
};

const EditContext = createContext<EditContextType | undefined>(undefined);

type EditContextProviderProps = {
  children: React.ReactNode;
};

export function EditContextProvider({ children }: EditContextProviderProps) {
  const [edit, setEdit] = useState<EditObject | undefined>(undefined);

  return (
    <EditContext.Provider value={{ edit, setEdit }}>
      {children}
    </EditContext.Provider>
  );
}

export function useEdit() {
  const context = useContext(EditContext);
  if (!context) {
    throw new Error("useEdit must be used within an EditContextProvider");
  }
  return context;
}
