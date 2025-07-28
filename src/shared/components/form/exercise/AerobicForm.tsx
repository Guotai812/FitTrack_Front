const baseUrl = import.meta.env.VITE_BACKEND_URL;
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
    {
      duration: {
        value: 30,
        isValid: true,
      },
    },
    true
  );
  const { id, setId } = useExercise();
  const { ePool } = usePool();
  const selectedExercise = ePool[id];

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = {
      type: selectedExercise.type,
      eId: id,
      duration: formState.inputs.duration.value,
    };
    try {
      const responseData = await sendRequest({
        url: `${baseUrl}/basic/${user?.userId}/addExercise`,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      updateInfo(responseData.updated);
    } catch (err) {
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
          <div className="">
            <div className="flex flex-col gap-5 jutify-center items-center h-full">
              <img
                src={selectedExercise.image}
                alt={selectedExercise.name}
                className="w-[20%]"
              />
              <p>{selectedExercise.name}</p>
            </div>
            <div className="text-center flex items-center justify-center">
              <Input
                type="number"
                label="Duration"
                name="duration"
                width="w-[30%]"
                value={formState.inputs.duration.value}
                isValid={formState.inputs.duration.isValid}
                isTouched={touched["duration"]}
                onBlur={() => blurHandler("duration")}
                errMsg="Invalid!"
                onChange={(e) =>
                  inputHandler(
                    "duration",
                    Number(e.target.value),
                    validator("duration", e.target.value)
                  )
                }
              />
              <span>minute</span>
            </div>
          </div>

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
