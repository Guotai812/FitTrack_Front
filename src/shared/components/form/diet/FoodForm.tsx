const baseUrl = import.meta.env.VITE_BACKEND_URL;
import type React from "react";
import { useUser } from "../../../context/UserContext/UserContext";
import { useDiet } from "../../../context/diet/DietManageContext";
import { useFood } from "../../../context/diet/FoodContext";
import { usePool } from "../../../context/PoolConetext";
import { useForm } from "../../../hooks/useForm/useForm";
import { useAuth } from "../../../context/AuthContext";
import { useModal } from "../../../hooks/useModal";
import { useMeal } from "../../../context/diet/MealContext";
import useHttp from "../../../hooks/useHttp";
import useInput from "../../../hooks/useInput";
import validator from "../../../util/validator";

import Button from "../../ui/Button";
import Form from "../../ui/Form";
import Input from "../../ui/Input";
import ErrorModal from "../../ui/ErrorModal";
import Ratio from "../../ui/Ratio";

export default function FoodForm() {
  const { updateInfo } = useUser();
  const { meal } = useMeal();
  const { show, modalCancelHandler, modalDisplayHandler } = useModal();
  const { user, token } = useAuth();
  const { error, isLoading, sendRequest } = useHttp();
  const { formState, inputHandler } = useForm(
    {
      weight: {
        value: 100,
        isValid: true,
      },
      meal: {
        value: "main",
        isValid: true,
      },
    },
    true
  );
  const { touched, blurHandler } = useInput();
  const { foodId } = useFood();
  const { pool } = usePool();
  const { setState } = useDiet();

  const clickedFood = Object.values(pool).find((food) => food._id === foodId);
  const weight = Number(formState.inputs.weight.value) / 100;

  async function submitHandler(e: React.FocusEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const today = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Australia/Sydney",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date());
      const updated = await sendRequest({
        url: `${baseUrl}/basic/${user?.userId}/addDiet`,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: {
          name: foodId,
          weight: formState.inputs.weight.value,
          kcal: weight * (clickedFood?.kcal ?? 0),
          meal,
          isMain: formState.inputs.meal.value === "main",
          date: today,
        },
      });
      updateInfo(updated);
      setState("pool");
    } catch (err) {
      modalDisplayHandler();
    }
  }

  if (error && show) {
    return (
      <ErrorModal title="Failed!" msg={error} onCancel={modalCancelHandler} />
    );
  }

  return (
    <Form isStyled={false} className="w-5/6" onSubmit={submitHandler}>
      <input type="hidden" name="name" defaultValue={clickedFood?.name} />
      <input type="hidden" name="meal" defaultValue={clickedFood?.name} />
      <div className="h-full p-6 flex flex-col justify-between ">
        <div className="h-full">
          <div className="mb-15">
            <img
              src={clickedFood?.image}
              alt={clickedFood?.name}
              className="mx-auto w-[20%] rounded-full object-cover"
            />
          </div>

          <div className="text-center">
            <p className="text-xl text-gray-600">
              {`Kcal ${
                Math.round(weight * Number(clickedFood?.kcal) * 10) / 10
              }kj • C ${
                Math.round(weight * Number(clickedFood?.carbon) * 10) / 10
              }g • P ${
                Math.round(weight * Number(clickedFood?.protein) * 10) / 10
              } • F ${
                Math.round(weight * Number(clickedFood?.fat) * 10) / 10
              }g`}
            </p>
          </div>

          <div className="flex items-center justify-center text-xl gap-5 mt-10">
            <Ratio
              name="meal"
              value="main"
              defaultChecked
              onChange={(e) => inputHandler("meal", e.target.value, true)}
            >
              Main
            </Ratio>
            <Ratio
              name="meal"
              value="extra"
              onChange={(e) => inputHandler("meal", e.target.value, true)}
            >
              Extra
            </Ratio>
          </div>

          <div className="mt-10 flex items-center justify-center">
            <Input
              type="number"
              name="weight"
              placeholder="Enter Weight"
              width={"[50%]"}
              className=" border border-gray-300 rounded px-3 py-2"
              isValid={formState.inputs.weight.isValid}
              value={Number(formState.inputs.weight.value)}
              isTouched={touched["weight"]}
              onBlur={() => blurHandler("weight")}
              errMsg="Please enter valid number"
              onChange={(e) =>
                inputHandler(
                  "weight",
                  Number(e.target.value),
                  validator("weight", e.target.value)
                )
              }
            />
            <p>g</p>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" kind="cancel" onClick={() => setState("pool")}>
            Cancel
          </Button>
          <Button kind="confirm" disabled={!formState.isValid || isLoading}>
            Confirm
          </Button>
        </div>
      </div>
    </Form>
  );
}
