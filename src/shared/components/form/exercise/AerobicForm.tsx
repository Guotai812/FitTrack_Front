import React, { useEffect } from "react";
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

type DataPoint = [string, number];
type DataSeries = DataPoint[];

type ResponseG = {
  msg: string;
  data: DataSeries;
};

export default function AerobicForm() {
  const { info } = useUser();
  const { show, modalCancelHandler, modalDisplayHandler } = useModal();
  const { updateInfo } = useUser();
  const { user, token } = useAuth();
  const { error, isLoading, sendRequest } = useHttp<Response>();
  const {
    error: getError,
    isLoading: getIsLoading,
    sendRequest: sendGetRequest,
  } = useHttp<ResponseG>();

  const { touched, blurHandler } = useInput();

  const { id, setId } = useExercise();
  const { ePool } = usePool();
  const selectedExercise = ePool[id];
  const { formState, inputHandler } = useForm(
    { duration: { value: 30, isValid: true } },
    true
  );

  useEffect(() => {
    async function getHistory() {
      try {
        const responseData = await sendGetRequest({
          url: `${import.meta.env.VITE_BACKEND_URL}/users/${
            user?.userId
          }/${id}/${selectedExercise.type}/getExerciseHis`,
          headers: { Authorization: `Bearer ${token}` },
        });

        const history = responseData.data as DataPoint[];
        const latestValue =
          history.length === 0 || history[0].length < 2
            ? 30
            : history[history.length - 1][1];

        inputHandler("duration", latestValue, true);
      } catch (err) {
        modalDisplayHandler();
      }
    }
    getHistory();
  }, [id, token, user?.userId, inputHandler]);

  const duration = Number(formState.inputs.duration.value) || 0;

  // make sure the nullish coalescing happens *before* the multiplications:
  const kcalRaw =
    (((ePool[id].met ?? 0) * // ← default MET to 0
      3.5 * // oxygen uptake constant
      info.weight) / // your weight in kg
      200) * // factor to convert to kcal/min
    duration; // minutes

  const kcal = Math.round(kcalRaw * 10) / 10; // one decimal place
  async function submitHandler(e: React.FormEvent) {
    e.preventDefault();
    try {
      const responseData = await sendRequest({
        url: `${import.meta.env.VITE_BACKEND_URL}/basic/${
          user?.userId
        }/${id}/addExercise`,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: {
          type: selectedExercise.type,
          duration: formState.inputs.duration.value,
          kcal,
        },
      });
      updateInfo(responseData.updated);
      setId("");
    } catch {
      modalDisplayHandler();
    }
  }

  return (
    <>
      {show && (error || getError) && (
        <ErrorModal
          onCancel={modalCancelHandler}
          title="Failed"
          msg={error === null ? getError : error}
        />
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
            <Button
              kind="confirm"
              disabled={!formState.isValid || isLoading || getIsLoading}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
}
