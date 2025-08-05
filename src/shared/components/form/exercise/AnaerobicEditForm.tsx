const baseUrl = import.meta.env.VITE_BACKEND_URL;
import { useAnaForm, type SetType } from "../../../hooks/useAnaForm";
import useHttp from "../../../hooks/useHttp";
import type { Exercise } from "../../../context/PoolConetext";
import type {
  AnaerobicItem,
  SetItem,
} from "../../../context/UserContext/UserContextType";
import validator from "../../../util/validator";
import useAnaInput from "../../../hooks/useAnaInput";
import { useDelete } from "../../../context/diet/DeleteContext";
import type React from "react";
import type { Response } from "./AnaerobicForm";
import { useAuth } from "../../../context/AuthContext";

import Form from "../../ui/Form";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { useUser } from "../../../context/UserContext/UserContext";
import { useModal } from "../../../hooks/useModal";
import ErrorModal from "../../ui/ErrorModal";

type AnaerobicEditFormProps = {
  userExercise: AnaerobicItem;
  selectedExercise: Exercise;
  onCancel: () => void;
};

export default function AnaerobicEditForm({
  selectedExercise,
  userExercise,
  onCancel,
}: AnaerobicEditFormProps) {
  const { setIsDelete } = useDelete();
  const { formState, inputHandler, addSetHandler, removeSetHandler } =
    useAnaForm(
      userExercise.sets.map(({ weight, reps, sets: setCount }) => ({
        weight: { value: weight, isValid: true },
        reps: { value: reps, isValid: true },
        sets: { value: setCount, isValid: true },
      })),
      true
    );
  const { touched, blurHandler } = useAnaInput(formState.sets);
  const { error, isLoading, sendRequest } = useHttp<Response>();
  const { user, token } = useAuth();
  const { updateInfo } = useUser();
  const { show, modalCancelHandler, modalDisplayHandler } = useModal();

  function isChanged(original: SetItem[], current: SetType[]): boolean {
    const oL = original.length;
    const cL = current.length;
    if (oL !== cL) return true;
    for (let i = 0; i < oL; i++) {
      if (
        original[i].weight != current[i].weight.value ||
        original[i].reps != current[i].reps.value ||
        original[i].sets != current[i].sets.value
      )
        return true;
    }
    return false;
  }

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const updatedValue = formState.sets.map(({ weight, reps, sets }) => ({
      weight: weight.value,
      reps: reps.value,
      sets: sets.value,
    }));
    try {
      const responseData = await sendRequest({
        url: `${baseUrl}/basic/${user?.userId}/updateExercise`,
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: {
          type: selectedExercise.type,
          rid: userExercise.rid,
          updatedValue,
          eid: selectedExercise._id,
        },
      });
      updateInfo(responseData.updated);
      onCancel();
    } catch (err) {
      modalDisplayHandler();
    }
  }
  return (
    <>
      {show && error && (
        <ErrorModal onCancel={modalCancelHandler} title="Error!" msg={error} />
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
        </div>
        <div>
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
                  disabled={formState.sets.length === 1}
                  onClick={() => removeSetHandler(idx)}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ol>
          <div className="text-center">
            <Button
              type="button"
              kind="confirm"
              className="mt-6"
              onClick={addSetHandler}
            >
              New Set
            </Button>
          </div>
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
            <Button
              kind="confirm"
              disabled={
                !formState.isValid ||
                !isChanged(userExercise.sets, formState.sets || isLoading)
              }
            >
              Update
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
}
