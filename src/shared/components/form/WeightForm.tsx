const baseUrl = import.meta.env.VITE_BACKEND_URL;
import type React from "react";
import type { Response } from "./exercise/AnaerobicForm";
import { useForm } from "../../hooks/useForm/useForm";
import { useUser } from "../../context/UserContext/UserContext";
import validator from "../../util/validator";
import useInput from "../../hooks/useInput";
import useHttp from "../../hooks/useHttp";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../hooks/useModal";

import Form from "../ui/Form";
import { Modal } from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import ErrorModal from "../ui/ErrorModal";

type WeightFormProps = {
  onCancel: () => void;
};

export default function WeightForm({ onCancel }: WeightFormProps) {
  const { show, modalCancelHandler, modalDisplayHandler } = useModal();
  const { user, token } = useAuth();
  const { error, isLoading, sendRequest } = useHttp<Response>();
  const { touched, blurHandler } = useInput();
  const { info, updateInfo } = useUser();
  const { formState, inputHandler } = useForm(
    {
      weight: { value: info.weight, isValid: true },
    },
    true
  );

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const responseData = await sendRequest({
        url: `${baseUrl}/users/${user?.userId}/updateWeight`,
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: { weight: formState.inputs.weight.value },
      });
      updateInfo(responseData.updated);
      onCancel();
    } catch (err) {
      modalDisplayHandler();
    }
  }
  if (show) {
    return (
      <ErrorModal onCancel={modalCancelHandler} title="Error" msg={error} />
    );
  }
  return (
    <Modal onCancel={onCancel}>
      <Form title="Record Weight" onSubmit={submitHandler}>
        <div>
          <Input
            type="number"
            name="weight"
            label="Weight"
            id="weight"
            value={formState.inputs.weight.value}
            onChange={(e) =>
              inputHandler(
                "weight",
                Number(e.target.value),
                validator("weight", e.target.value)
              )
            }
            onBlur={() => blurHandler("weight")}
            isTouched={touched["weight"]}
            errMsg="Invalid Weight!"
            isValid={formState.inputs.weight.isValid}
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button type="button" kind="cancel" onClick={onCancel}>
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
