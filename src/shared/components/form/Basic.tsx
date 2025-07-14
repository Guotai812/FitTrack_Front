const baseUrl = import.meta.env.VITE_BACKEND_URL;
import { useForm } from "../../hooks/useForm/useForm";
import validator from "../../util/validator";

import Form from "../ui/Form";
import Input from "../ui/Input";
import useInput from "../../hooks/useInput";
import Button from "../ui/Button";
import Select from "../ui/Select";
import useHttp from "../../hooks/useHttp";
import type React from "react";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../hooks/useModal";
import ErrorModal from "../ui/ErrorModal";

type BasicInfoProps = {
  onCancel: () => void;
};

export default function BasicInfo({ onCancel }: BasicInfoProps) {
  const auth = useAuth();
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
  const { error, isLoading, sendRequest } = useHttp<{ msg: string }>();
  const { show, modalCancelHandler, modalDisplayHandler } = useModal();

  async function sumbitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = {
      userId: auth.user?.userId,
      weight: formState.inputs.weight.value,
      height: formState.inputs.height.value,
      frequency: formState.inputs.frequency.value,
      type: formState.inputs.type.value,
      gender: formState.inputs.gender.value,
      goal: formState.inputs.goal.value,
    };
    try {
      await sendRequest({
        url: `${baseUrl}/basic/${auth.user?.userId}/basicInformation`,
        method: "POST",
        headers: { Authorization: `Bearer ${auth.token}` },
        body: data,
      });
      onCancel();
    } catch (error) {
      modalDisplayHandler();
    }
  }
  if (error && show) {
    return (
      <ErrorModal onCancel={modalCancelHandler} title="Error" msg={error} />
    );
  }

  return (
    <Form title="Welcome to FitTrack" onSubmit={sumbitHandler}>
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
      <Select
        name="gender"
        label="Gender"
        items={["Male", "Female"]}
        isValid={formState.inputs.gender.isValid}
        isTouched={touched["gender"]}
        onBlur={() => blurHandler("gender")}
        onChange={(e) =>
          inputHandler(
            "gender",
            e.target.value,
            validator("gender", e.target.value)
          )
        }
      />
      <Select
        name="frequency"
        label="Weekly workout frequency"
        items={["0", "1-3", "3-5", "over 5"]}
        isValid={formState.inputs.frequency.isValid}
        isTouched={touched["frequency"]}
        onBlur={() => blurHandler("frequency")}
        onChange={(e) =>
          inputHandler(
            "frequency",
            e.target.value,
            validator("frequency", e.target.value)
          )
        }
      />
      <Select
        name="type"
        label="Preferred Exercise Type"
        items={["Aerobic", "Anaerobic"]}
        isValid={formState.inputs.type.isValid}
        isTouched={touched["type"]}
        onBlur={() => blurHandler("type")}
        onChange={(e) =>
          inputHandler(
            "type",
            e.target.value,
            validator("type", e.target.value)
          )
        }
      />
      <Select
        name="goal"
        label="Primary Fitness Goal"
        items={["Lose fat", "Build muscle", "Keep fit"]}
        isValid={formState.inputs.goal.isValid}
        isTouched={touched["goal"]}
        onBlur={() => blurHandler("goal")}
        onChange={(e) =>
          inputHandler(
            "goal",
            e.target.value,
            validator("goal", e.target.value)
          )
        }
      />
      <div className="flex justify-end gap-4">
        <Button kind="cancel" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          kind="confirm"
          isLoading={isLoading}
          disabled={!formState.isValid || isLoading}
        >
          {isLoading && "Submitting..."}
          {!isLoading && "Submit"}
        </Button>
      </div>
    </Form>
  );
}
