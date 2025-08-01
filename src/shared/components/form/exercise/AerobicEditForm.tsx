const baseUrl = import.meta.env.VITE_BACKEND_URL;
import type { Exercise } from "../../../context/PoolConetext";
import type {
  AerobicItem,
  Info,
} from "../../../context/UserContext/UserContextType";
import { useForm } from "../../../hooks/useForm/useForm";
import useInput from "../../../hooks/useInput";
import validator from "../../../util/validator";
import useHttp from "../../../hooks/useHttp";
import { useAuth } from "../../../context/AuthContext";

import Button from "../../ui/Button";
import Form from "../../ui/Form";
import Input from "../../ui/Input";
import { useItem } from "../../../context/exercise/ItemContext";
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
  const { show, modalCancelHandler, modalDisplayHandler } = useModal();
  const { updateInfo } = useUser();
  // TODO: change to rid
  const { item } = useItem();
  const { user, token } = useAuth();
  const {
    error: deleteError,
    isLoading: deleteIsLoading,
    sendRequest: sendDelete,
  } = useHttp<{
    msg: string;
    updated: Info;
  }>();
  const { touched, blurHandler } = useInput();
  const { formState, inputHandler } = useForm(
    {
      duration: { value: userExercise.duration, isValid: true },
    },
    true
  );
  async function delteHandler() {
    try {
      const responseData = await sendDelete({
        url: `${baseUrl}/basic/${user?.userId}/deleteExercise`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        body: {
          rid: item.rid,
          type: item.type,
          eid: userExercise.eid,
          kcal: item.kcal,
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
      {show && deleteError && (
        <ErrorModal
          onCancel={modalCancelHandler}
          title="Error!"
          msg={deleteError}
        />
      )}
      <Form>
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
              onClick={delteHandler}
              disabled={deleteIsLoading}
            >
              Delete
            </Button>
            <Button kind="confirm" disabled={!formState.isValid}>
              Edit
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
}
