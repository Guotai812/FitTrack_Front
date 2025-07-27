import React, {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

type DeleteContextType = {
  isDelete: boolean | undefined;
  setIsDelete: Dispatch<SetStateAction<boolean | undefined>>;
};

const DeleteContext = createContext<DeleteContextType | undefined>(undefined);

export function DeleteContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDelete, setIsDelete] = useState<boolean | undefined>(false);

  return (
    <DeleteContext.Provider value={{ isDelete, setIsDelete }}>
      {children}
    </DeleteContext.Provider>
  );
}

export function useDelete() {
  const context = useContext(DeleteContext);
  if (!context) {
    throw new Error("useDelet should be used within DeleteContextProvider");
  }
  return context;
}
