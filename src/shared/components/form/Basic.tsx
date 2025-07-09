import { useForm } from "../../hooks/useForm/useForm";
import validator from "../../util/validator";

import Form from "../ui/Form";
import Input from "../ui/Input";
import useInput from "../../hooks/useInput";
import Button from "../ui/Button";

type BasicInfoProps = {
  onCancel: () => void;
};

export default function BasicInfo({ onCancel }: BasicInfoProps) {
  const { formState, inputHandler } = useForm(
    {
      weight: {
        value: 0,
        isValid: false,
      },
      height: {
        value: 0,
        isValid: false,
      },
      frequency: {
        value: "",
        isValid: false,
      },
      type: {
        value: "",
        isValid: false,
      },
      gender: {
        value: "",
        isValid: false,
      },
      goal: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  const { touched, blurHandler } = useInput();

  return (
    <Form title="Welcome to FitTrack">
      <Input
        type="number"
        label="Weight"
        name="weight"
        placeHolder="eg.70kg"
        errMsg="should be greater 0"
        isValid={formState.inputs.weight.isValid}
        isTouched={touched["weight"]}
        onBlur={() => blurHandler("weight")}
        onChange={(e) =>
          inputHandler(
            "weight",
            Number(e.target.value),
            validator("weight", Number(e.target.value))
          )
        }
      />
      <Input
        type="number"
        label="Height"
        name="height"
        placeHolder="eg.170cm"
        errMsg="should be greater 0"
        isValid={formState.inputs.height.isValid}
        isTouched={touched["height"]}
        onBlur={() => blurHandler("height")}
        onChange={(e) =>
          inputHandler(
            "height",
            Number(e.target.value),
            validator("height", Number(e.target.value))
          )
        }
      />
      <div className="flex justify-end gap-4">
        <Button kind="cancel" onClick={onCancel}>
          Cancel
        </Button>
        <Button kind="confirm">Submit</Button>
      </div>
    </Form>
  );
}
