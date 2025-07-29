import { useState, useEffect } from "react";

type Input = {
  weight: boolean;
  reps: boolean;
  sets: boolean; // you might rename this to avoid confusion with the array!
};

export default function useAnaInput<T>(items: T[]): {
  touched: Input[];
  blurHandler: (idx: number, field: keyof Input) => void;
} {
  // 1) Raw flag storage
  const [rawTouched, setRawTouched] = useState<Input[]>(() =>
    items.map(() => ({ weight: false, reps: false, sets: false }))
  );

  // 2) If items shrink, trim the raw storage
  useEffect(() => {
    setRawTouched((prev) => prev.slice(0, items.length));
  }, [items.length]);

  // 3) Always build a "touched" that is exactly items.length,
  //    defaulting new slots to all-false
  const touched: Input[] = items.map(
    (_, i) => rawTouched[i] ?? { weight: false, reps: false, sets: false }
  );

  // 4) When blurring, make sure rawTouched is long enough, then flip one flag
  function blurHandler(idx: number, field: keyof Input) {
    setRawTouched((prev) => {
      // make a copy and extend if needed
      const next =
        prev.length > idx
          ? [...prev]
          : [
              ...prev,
              ...Array(idx - prev.length + 1).fill({
                weight: false,
                reps: false,
                sets: false,
              }),
            ];

      // flip the one field
      next[idx] = { ...next[idx], [field]: true };
      return next;
    });
  }

  return { touched, blurHandler };
}
