import type React from "react";
import { useState } from "react";

type UserProviderProps = {
  children: React.ReactNode;
};

export function UserProvider({ children }: UserProviderProps) {
  const [info, setInfo] = useState({
    kcal: 0,
    weight: 0,
    height: 0,
    age: 0,
  });
}
