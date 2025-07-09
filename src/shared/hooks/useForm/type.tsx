// types.ts
export interface FormInput {
  value: string | number;
  isValid: boolean;
}

export interface FormState {
  inputs: { [inputId: string]: FormInput };
  isValid: boolean;
}

type FormAction =
  | {
      type: "CHANGE";
      inputId: string;
      value: string | number;
      isValid: boolean;
    }
  | {
      type: "SET_DATA";
      inputs: { [inputId: string]: FormInput };
      formIsValid: boolean;
    };

export function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "CHANGE":
      const updatedInputs = {
        ...state.inputs,
        [action.inputId]: {
          value: action.value,
          isValid: action.isValid,
        },
      };
      // recompute overall form validity
      const formIsValid = Object.values(updatedInputs).every((i) => i.isValid);
      return {
        inputs: updatedInputs,
        isValid: formIsValid,
      };

    case "SET_DATA":
      return {
        inputs: action.inputs,
        isValid: action.formIsValid,
      };

    default:
      return state;
  }
}
