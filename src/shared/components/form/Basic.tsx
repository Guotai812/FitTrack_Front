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
import ResultModal from "../ui/ResultModal";

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
      birthdate: {
        value: 0,
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
  const {
    show: showError,
    modalCancelHandler: errorCancel,
    modalDisplayHandler: errorDisplay,
  } = useModal();
  const { show: resultShow, modalDisplayHandler: resultDisplay } = useModal();

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
      birthdate: formState.inputs.birthdate.value,
    };
    try {
      await sendRequest({
        url: `${baseUrl}/basic/${auth.user?.userId}/basicInformation`,
        method: "POST",
        headers: { Authorization: `Bearer ${auth.token}` },
        body: data,
      });
      auth.updateIsCompleted();
      resultDisplay();
    } catch (error) {
      errorDisplay();
    }
  }
  if (error && showError) {
    return <ErrorModal onCancel={errorCancel} title="Error" msg={error} />;
  }

  if (resultShow) {
    return (
      <ResultModal
        onCancel={onCancel}
        title="Congraulation!"
        msg="Welcome aboard"
      />
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
            validator("weight", e.target.value)
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
            validator("height", e.target.value)
          )
        }
      />
      <Input
        type="date"
        label="Birthdate"
        name="birthdate"
        errMsg="could not be empty"
        isValid={formState.inputs.birthdate.isValid}
        isTouched={touched["birthdate"]}
        onBlur={() => blurHandler("birthdate")}
        onChange={(e) =>
          inputHandler(
            "birthdate",
            e.target.value,
            validator("birthdate", e.target.value)
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
