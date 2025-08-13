const baseUrl = import.meta.env.VITE_BACKEND_URL;
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import Form from "../ui/Form";
import { Modal } from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useForm } from "../../hooks/useForm/useForm";
import useInput from "../../hooks/useInput";
import validator from "../../util/validator";
import ImageUpload from "../ui/ImageUpload";
import type React from "react";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../hooks/useModal";
import ErrorModal from "../ui/ErrorModal";

type UpLoadFoodFormProps = {
  onCancel: () => void;
  setState: Dispatch<SetStateAction<"ex" | "food" | undefined>>;
};

export default function UpLoadFoodForm({
  onCancel,
  setState,
}: UpLoadFoodFormProps) {
  const { formState, inputHandler } = useForm(
    {
      name: { value: "", isValid: false },
      image: { value: "", isValid: false },
      kcal: { value: "", isValid: false },
      carbon: { value: "", isValid: false },
      protein: { value: "", isValid: false },
      fat: { value: "", isValid: false },
    },
    false
  );
  const { touched, blurHandler } = useInput();
  function clickCancelHandler() {
    onCancel();
    setState(undefined);
  }
  const { user, token } = useAuth();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { show, modalCancelHandler, modalDisplayHandler } = useModal();
  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setIsLoading(true);
      const form = new FormData();
      form.append("name", String(formState.inputs.name.value));
      const file = formState.inputs.image.value;
      if (file instanceof File) {
        form.append("image", file);
      }
      form.append("kcal", String(formState.inputs.kcal.value));
      form.append("carbon", String(formState.inputs.carbon.value));
      form.append("protein", String(formState.inputs.protein.value));
      form.append("fat", String(formState.inputs.fat.value));
      const res = await fetch(`${baseUrl}/pool/${user?.userId}/uploadFood`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(String(err));
      modalDisplayHandler();
    } finally {
      setIsLoading(false);
    }
  }

  if (show) {
    return (
      <ErrorModal onCancel={modalCancelHandler} title="Error" msg={error} />
    );
  }
  return (
    <Modal onCancel={onCancel} setState={setState} size="w-[30%]">
      <Form title="Upload Customized Food" onSubmit={submitHandler}>
        <div className="flex justify-between gap-6">
          <Input
            type="text"
            name="name"
            label="Food Name"
            value={String(formState.inputs.name.value)}
            onChange={(e) =>
              inputHandler(
                "name",
                e.target.value,
                validator("userName", e.target.value)
              )
            }
            isTouched={touched["name"]}
            onBlur={() => blurHandler("name")}
            isValid={formState.inputs.name.isValid}
            errMsg="Invalid Value"
          />

          <ImageUpload id="image" onInput={inputHandler} />
        </div>

        <Input
          type="number"
          name="kcal"
          label="Kcal"
          placeHolder="kcal per 100g"
          value={
            formState.inputs.kcal.value === ""
              ? ""
              : Number(formState.inputs.kcal.value)
          }
          onChange={(e) =>
            inputHandler(
              "kcal",
              Number(e.target.value),
              validator("kcal", e.target.value)
            )
          }
          isTouched={touched["kcal"]}
          onBlur={() => blurHandler("kcal")}
          isValid={formState.inputs.kcal.isValid}
          errMsg="Invalid Value"
        />
        <Input
          type="number"
          name="carbon"
          label="Carbon"
          placeHolder="carbon per 100g"
          value={
            formState.inputs.carbon.value === ""
              ? ""
              : Number(formState.inputs.carbon.value)
          }
          onChange={(e) =>
            inputHandler(
              "carbon",
              Number(e.target.value),
              validator("carbon", e.target.value)
            )
          }
          isTouched={touched["carbon"]}
          onBlur={() => blurHandler("carbon")}
          isValid={formState.inputs.carbon.isValid}
          errMsg="Invalid Value"
        />
        <Input
          type="number"
          name="protein"
          label="Protein"
          placeHolder="protein per 100g"
          value={
            formState.inputs.protein.value === ""
              ? ""
              : Number(formState.inputs.protein.value)
          }
          onChange={(e) =>
            inputHandler(
              "protein",
              Number(e.target.value),
              validator("protein", e.target.value)
            )
          }
          isTouched={touched["protein"]}
          onBlur={() => blurHandler("protein")}
          isValid={formState.inputs.protein.isValid}
          errMsg="Invalid Value"
        />
        <Input
          type="number"
          name="fat"
          label="Fat"
          placeHolder="fat per 100g"
          value={
            formState.inputs.fat.value === ""
              ? ""
              : Number(formState.inputs.fat.value)
          }
          onChange={(e) =>
            inputHandler(
              "fat",
              Number(e.target.value),
              validator("fat", e.target.value)
            )
          }
          isTouched={touched["fat"]}
          onBlur={() => blurHandler("fat")}
          isValid={formState.inputs.fat.isValid}
          errMsg="Invalid Value"
        />
        <div className="flex justify-end gap-4">
          <Button type="button" onClick={clickCancelHandler} kind="cancel">
            Cancel
          </Button>
          <Button kind="confirm" disabled={!formState.isValid || isLoading}>
            Confirm
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
