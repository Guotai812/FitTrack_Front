const baseUrl = import.meta.env.VITE_BACKEND_URL;
import type React from "react";
import useHttp from "../../../hooks/useHttp";
import { useForm } from "../../../hooks/useForm/useForm";
import useInput from "../../../hooks/useInput";
import validator from "../../../util/validator";
import { useDelete } from "../../../context/diet/DeleteContext";
import { useAuth } from "../../../context/AuthContext";
import type { Response } from "./AnaerobicForm";

import type { Exercise } from "../../../context/PoolConetext";
import type { AerobicItem } from "../../../context/UserContext/UserContextType";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import Input from "../../ui/Input";
import { useUser } from "../../../context/UserContext/UserContext";
import { useModal } from "../../../hooks/useModal";
import ErrorModal from "../../ui/ErrorModal";

type AerobicEditFormProps = {
  onCancel: () => void;
  selectedExercise: Exercise;
  userExercise: AerobicItem;
};

export default function AerobicEditForm({
  selectedExercise,
  userExercise,
  onCancel,
}: AerobicEditFormProps) {
  const { setIsDelete } = useDelete();
  const { touched, blurHandler } = useInput();
  const { formState, inputHandler } = useForm(
    {
      duration: { value: userExercise.duration, isValid: true },
    },
    true
  );
  const { error, isLoading, sendRequest } = useHttp<Response>();
  const { user, token } = useAuth();
  const { updateInfo } = useUser();
  const { show, modalCancelHandler, modalDisplayHandler } = useModal();

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const responseData = await sendRequest({
        url: `${baseUrl}/basic/${user?.userId}/updateExercise`,
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: {
          type: selectedExercise.type,
          rid: userExercise.rid,
          updatedValue: formState.inputs.duration.value,
        },
      });
      updateInfo(responseData.updated);
    } catch (err) {
      modalDisplayHandler();
    }
  }

  return (
    <>
      {show && error && (
        <ErrorModal onCancel={modalCancelHandler} title="Error" msg={error} />
      )}
      <Form onSubmit={submitHandler}>
        <div>
          <div className="flex w-full h-full items-center justify-center">
            <div className="text-center">
              <img
                src={selectedExercise.image}
                alt={selectedExercise.name}
                className="rounded-full w-1/5 mx-auto"
              />
              <p className="mt-2">{selectedExercise.name}</p>
            </div>
          </div>
          <Input
            type="number"
            name="duration"
            label="Duration"
            value={formState.inputs.duration.value}
            onChange={(e) =>
              inputHandler(
                "duration",
                Number(e.target.value),
                validator("duration", e.target.value)
              )
            }
            errMsg="Invalid"
            onBlur={() => blurHandler("duration")}
            isTouched={touched["duration"]}
            isValid={formState.inputs.duration.isValid}
          />
        </div>

        <div className="flex justify-between">
          <Button onClick={onCancel} kind="gray" type="button">
            Cancel
          </Button>
          <div className="flex gap-4">
            <Button
              kind="cancel"
              type="button"
              onClick={() => setIsDelete(true)}
            >
              Delete
            </Button>
            <Button kind="confirm" disabled={!formState.isValid || isLoading}>
              Update
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
}
