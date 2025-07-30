import { useExercise } from "../../../context/exercise/ExerciseContext";
import { usePool } from "../../../context/PoolConetext";
import type { Info } from "../../../context/UserContext/UserContextType";
import { useAnaForm } from "../../../hooks/useAnaForm";
import { useModal } from "../../../hooks/useModal";
import validator from "../../../util/validator";
import useHttp from "../../../hooks/useHttp";
import { useEffect, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import useAnaInput from "../../../hooks/useAnaInput";

import Form from "../../ui/Form";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import ErrorModal from "../../ui/ErrorModal";

type Response = {
  msg: string;
  updated: Info;
};

type Data = {
  weight: number;
  reps: number;
  sets: number;
};

type Entry = [string, Data[]];

type GetReponse = {
  msg: string;
  data: Entry[];
};

export default function AerobicForm() {
  const { user, token } = useAuth();
  const { show, modalCancelHandler, modalDisplayHandler } = useModal();
  const { error, isLoading, sendRequest } = useHttp<Response>();
  const {
    error: getError,
    isLoading: getIsLoading,
    sendRequest: sendGetRequest,
  } = useHttp<GetReponse>();
  const { formState, inputHandler, addSetHandler, removeSetHandler } =
    useAnaForm(
      [
        {
          weight: { value: 20, isValid: true },
          reps: { value: 8, isValid: true },
          sets: { value: 4, isValid: true },
        },
      ],
      true
    );
  const { touched, blurHandler } = useAnaInput(formState.sets);
  const { id, setId } = useExercise();
  const { ePool } = usePool();
  const selectedExercise = ePool[id];

  const effectRan = useRef(false);

  // guard the getHis run once
  useEffect(() => {
    if (!effectRan.current) {
      getHistory();
      effectRan.current = true;
    }
  }, []);

  async function getHistory() {
    try {
      const responseData = await sendGetRequest({
        url: `${import.meta.env.VITE_BACKEND_URL}/users/${user?.userId}/${id}/${
          selectedExercise.type
        }/getExerciseHis`,
        headers: { Authorization: `Bearer ${token}` },
      });

      const latestValue = responseData.data[0][1] as Data[];

      latestValue.forEach((_, idx) => {
        if (idx > 0) {
          addSetHandler();
        }
      });

      latestValue.forEach((val, idx) => {
        inputHandler(idx, "weight", val.weight, true);
        inputHandler(idx, "reps", val.reps, true);
        inputHandler(idx, "sets", val.sets, true);
      });
    } catch (err) {
      modalDisplayHandler();
    }
  }
  // TODO: useEffect to get the latest data of selected exercise, otherwise use the default data

  return (
    <>
      {show && (error || getError) && (
        <ErrorModal
          onCancel={modalCancelHandler}
          title="Failed"
          msg={error === null ? getError : error}
        />
      )}

      <div className="flex flex-col justify-between p-6 overflow-auto">
        <div className="flex flex-col gap-4 jutify-center items-center">
          <img
            src={selectedExercise.image}
            alt={selectedExercise.name}
            className="w-[20%]"
          />
          <p>{selectedExercise.name}</p>
          <div>
            <Form className="flex flex-col justify-center items-center">
              <ol className="flex flex-col jutify-center items-center gap-4 mr-[4%]">
                {formState.sets.map((input, idx) => (
                  <li
                    key={idx}
                    className="flex justify-center items-center gap-2 h-10 ml-25"
                  >
                    <div className="flex flex-col justify-center items-center">
                      {idx === 0 && <p>Weight</p>}
                      <Input
                        width="[25%]"
                        type="number"
                        name="weight"
                        value={input.weight.value}
                        onChange={(e) =>
                          inputHandler(
                            idx,
                            "weight",
                            Number(e.target.value),
                            validator("weight", e.target.value)
                          )
                        }
                        isValid={input.weight.isValid}
                        isTouched={touched[idx]["weight"]}
                        onBlur={() => blurHandler(idx, "weight")}
                        errMsg="Invalid"
                      />
                    </div>
                    <div className="flex flex-col justify-center items-center">
                      {idx === 0 && <p>Reps</p>}
                      <Input
                        width="[25%]"
                        type="number"
                        name="reps"
                        value={input.reps.value}
                        onChange={(e) =>
                          inputHandler(
                            idx,
                            "reps",
                            Number(e.target.value),
                            validator("reps", e.target.value)
                          )
                        }
                        isValid={input.reps.isValid}
                        isTouched={touched[idx]["reps"]}
                        onBlur={() => blurHandler(idx, "reps")}
                        errMsg="Invalid"
                      />
                    </div>
                    <div className="flex flex-col justify-center items-center">
                      {idx === 0 && <p>Sets</p>}
                      <Input
                        width="[25%]"
                        type="number"
                        name="sets"
                        value={input.sets.value}
                        onChange={(e) =>
                          inputHandler(
                            idx,
                            "sets",
                            Number(e.target.value),
                            validator("sets", e.target.value)
                          )
                        }
                        isValid={input.sets.isValid}
                        isTouched={touched[idx]["sets"]}
                        onBlur={() => blurHandler(idx, "sets")}
                        errMsg="Invalid"
                      />
                    </div>

                    <Button
                      type="button"
                      kind="cancel"
                      disabled={idx === 0}
                      onClick={() => removeSetHandler(idx)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ol>
              <Button
                type="button"
                kind="confirm"
                className="mt-6"
                onClick={addSetHandler}
              >
                New Set
              </Button>
            </Form>
          </div>
        </div>

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
    </>
  );
}
