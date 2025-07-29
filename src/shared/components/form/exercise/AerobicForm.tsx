import React from "react";
import { useExercise } from "../../../context/exercise/ExerciseContext";
import { usePool } from "../../../context/PoolConetext";
import { useForm } from "../../../hooks/useForm/useForm";
import type { Info } from "../../../context/UserContext/UserContextType";

import Form from "../../ui/Form";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import useInput from "../../../hooks/useInput";
import validator from "../../../util/validator";
import useHttp from "../../../hooks/useHttp";
import { useAuth } from "../../../context/AuthContext";
import { useUser } from "../../../context/UserContext/UserContext";
import { useModal } from "../../../hooks/useModal";
import ErrorModal from "../../ui/ErrorModal";

type Response = {
  msg: string;
  updated: Info;
};

export default function AerobicForm() {
  const { show, modalCancelHandler, modalDisplayHandler } = useModal();
  const { updateInfo } = useUser();
  const { user, token } = useAuth();
  const { error, isLoading, sendRequest } = useHttp<Response>();

  const { touched, blurHandler } = useInput();
  const { formState, inputHandler } = useForm(
    { duration: { value: 30, isValid: true } },
    true
  );

  const { id, setId } = useExercise();
  const { ePool } = usePool();
  const selectedExercise = ePool[id];

  async function submitHandler(e: React.FormEvent) {
    e.preventDefault();
    try {
      const responseData = await sendRequest({
        url: `${import.meta.env.VITE_BACKEND_URL}/basic/${
          user?.userId
        }/addExercise`,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: {
          type: selectedExercise.type,
          eId: id,
          duration: formState.inputs.duration.value,
        },
      });
      updateInfo(responseData.updated);
    } catch {
      modalDisplayHandler();
    }
  }

  return (
    <>
      {show && error && (
        <ErrorModal onCancel={modalCancelHandler} title="Failed" msg={error} />
      )}

      <Form className="w-5/6" onSubmit={submitHandler}>
        <div className="p-6 flex flex-col justify-between gap-10 h-full">
          {/* Image + Name */}
          <div>
            <div className="flex flex-col gap-5 justify-center items-center mb-6">
              <img
                src={selectedExercise.image}
                alt={selectedExercise.name}
                className="w-[20%]"
              />
              <p className="text-lg font-medium">{selectedExercise.name}</p>
            </div>

            {/* Duration field */}
            <div className="flex flex-col items-center">
              {/* Your built-in label */}
              <Input
                type="number"
                label="Duration(minute)"
                name="duration"
                width="w-[30%]"
                value={formState.inputs.duration.value}
                isValid={formState.inputs.duration.isValid}
                isTouched={touched.duration}
                onBlur={() => blurHandler("duration")}
                errMsg="Invalid!"
                onChange={(e) =>
                  inputHandler(
                    "duration",
                    Number(e.target.value),
                    validator("duration", e.target.value)
                  )
                }
                className="!mb-0" // remove any bottom margin so flex baseline works
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button onClick={() => setId("")} type="button" kind="cancel">
              Cancel
            </Button>
            <Button kind="confirm" disabled={!formState.isValid || isLoading}>
              Confirm
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
}
