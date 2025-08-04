import { useState } from "react";
type Value = {
  value: number;
  isValid: boolean;
};

export type SetType = {
  weight: Value;
  reps: Value;
  sets: Value;
};

export type InputType = {
  sets: SetType[];
  isValid: boolean;
};

export function useAnaForm(initialValue: SetType[], initialValidity: boolean) {
  const [formState, setFormState] = useState<InputType>({
    sets: initialValue,
    isValid: initialValidity,
  });
  function inputHandler(
    idx: number,
    name: string,
    value: number,
    isValid: boolean
  ) {
    setFormState((prev) => {
      // 1️⃣ clone the array
      const newSets = [...prev.sets];

      // 2️⃣ overwrite the one SetType at position idx
      newSets[idx] = {
        ...newSets[idx],
        [name]: { value, isValid },
      };

      // 3️⃣ (optional) recompute overall form validity
      const formIsValid = newSets.every(
        (s) => s.weight.isValid && s.reps.isValid && s.sets.isValid
      );

      return {
        sets: newSets,
        isValid: formIsValid,
      };
    });
  }
  function addSetHandler() {
    setFormState((prev) => {
      // clone the array
      const newSets = [...prev.sets];

      // grab the last set
      const last = prev.sets[prev.sets.length - 1];

      // shallow-clone its fields (so you don't keep references to the same nested objects)
      const clonedSet: SetType = {
        weight: { ...last.weight },
        reps: { ...last.reps },
        sets: { ...last.sets },
      };

      // push exactly one new SetType
      newSets.push(clonedSet);

      // re-check overall form validity
      const formIsValid = newSets.every(
        (s) => s.weight.isValid && s.reps.isValid && s.sets.isValid
      );

      return {
        sets: newSets,
        isValid: formIsValid,
      };
    });
  }

  function removeSetHandler(idx: number) {
    setFormState((prev) => {
      // 1) shallow-clone the array
      const newSets = [...prev.sets];

      // 2) remove exactly the one at position `idx`
      newSets.splice(idx, 1);

      // 3) recompute overall validity
      const formIsValid = newSets.every(
        (s) => s.weight.isValid && s.reps.isValid && s.sets.isValid
      );

      // 4) return updated state
      return {
        sets: newSets,
        isValid: formIsValid,
      };
    });
  }
  return { formState, inputHandler, addSetHandler, removeSetHandler };
}
