// useForm.ts
import { useReducer, useCallback } from "react";
import { formReducer } from "./type";
import type { FormInput } from "./type";

export function useForm(
  initialInputs: { [inputId: string]: FormInput },
  initialFormValidity: boolean
) {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity,
  });

  // call this from your <Input> components
  const inputHandler = useCallback(
    (id: string, value: string | number, isValid: boolean) => {
      dispatch({ type: "CHANGE", inputId: id, value, isValid });
    },
    []
  );

  // if you ever need to programmatically set/reset the whole form
  const setFormData = useCallback(
    (inputs: { [inputId: string]: FormInput }, formValidity: boolean) => {
      dispatch({ type: "SET_DATA", inputs, formIsValid: formValidity });
    },
    []
  );

  return { formState, inputHandler, setFormData };
}
