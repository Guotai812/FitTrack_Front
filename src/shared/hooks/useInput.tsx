import { useState } from "react";

export default function useInput() {
  const [touched, setTouched] = useState<{ [id: string]: boolean }>({});

  function blurHandler(id: string): void {
    setTouched((prev) => ({ ...prev, [id]: true }));
  }
  return {
    touched,
    blurHandler,
  };
}
