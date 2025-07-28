const baseUrl = import.meta.env.VITE_BACKEND_URL;
import { usePool } from "../../../context/PoolConetext";
import { useUser } from "../../../context/UserContext/UserContext";
import { useEdit } from "../../../context/diet/EditContext";
import useInput from "../../../hooks/useInput";
import { useForm } from "../../../hooks/useForm/useForm";
import validator from "../../../util/validator";
import { useAuth } from "../../../context/AuthContext";
import { useDelete } from "../../../context/diet/DeleteContext";
import React, { useEffect, useState } from "react";
import { useModal } from "../../../hooks/useModal";

import Form from "../../ui/Form";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import useHttp from "../../../hooks/useHttp";
import ErrorModal from "../../ui/ErrorModal";

type FoodEditFormProps = {
  onCancel: () => void;
};

export default function FoodEditForm({ onCancel }: FoodEditFormProps) {
  const { setIsDelete } = useDelete();
  const { show, modalCancelHandler, modalDisplayHandler } = useModal();
  const { user, token } = useAuth();
  const { error, isLoading, sendRequest } = useHttp();
  const [hasChanged, setHasChanged] = useState<boolean>(false);
  const { touched, blurHandler } = useInput();
  const { info, updateInfo } = useUser();
  const { edit } = useEdit();
  const { pool } = usePool();
  const image = pool[edit?.foodId ?? ""]?.image;
  const name = pool[edit?.foodId ?? ""]?.name;
  const weight = info.diets[edit?.meal ?? "breakfast"][
    edit?.isMain ? "main" : "extra"
  ].find((item) => item.food === edit?.foodId)?.weight;
  const { formState, inputHandler } = useForm(
    {
      weight: {
        value: weight ?? 0,
        isValid: true,
      },
    },
    true
  );
  useEffect(() => {
    const current = formState.inputs["weight"]?.value;
    setHasChanged(current !== weight);
  }, [formState.inputs["weight"]?.value, weight]);

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const responseData = await sendRequest({
        url: `${baseUrl}/basic/${user?.userId}/editDiet`,
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: {
          meal: edit?.meal,
          isMain: edit?.isMain,
          food: edit?.foodId,
          weight: formState.inputs.weight.value,
          originalWeight: weight,
        },
      });
      updateInfo(responseData.updated);
    } catch (err) {
      modalDisplayHandler();
    }
  }

  if (show && error) {
    return (
      <ErrorModal onCancel={modalCancelHandler} title="Failed" msg={error} />
    );
  }
  return (
    <Form onSubmit={(e) => submitHandler(e)}>
      <div>
        <div className="flex w-full h-full items-center justify-center">
          <div className="text-center">
            <img
              src={image}
              alt={name}
              className="rounded-full w-1/5 mx-auto"
            />
            <p className="mt-2">{name}</p>
          </div>
        </div>
        <Input
          type="number"
          name="weight"
          label="Weight"
          value={formState.inputs.weight.value}
          onChange={(e) =>
            inputHandler(
              "weight",
              Number(e.target.value),
              validator("weight", e.target.value)
            )
          }
          errMsg="Invalid"
          onBlur={() => blurHandler("weight")}
          isTouched={touched["weight"]}
          isValid={formState.inputs.weight.isValid}
        />
      </div>

      <div className="flex justify-between">
        <Button onClick={onCancel} kind="gray" type="button">
          Cancel
        </Button>
        <div className="flex gap-4">
          <Button kind="cancel" type="button" onClick={() => setIsDelete(true)}>
            Delete
          </Button>
          <Button
            kind="confirm"
            disabled={!formState.isValid || !hasChanged || isLoading}
          >
            Edit
          </Button>
        </div>
      </div>
    </Form>
  );
}
