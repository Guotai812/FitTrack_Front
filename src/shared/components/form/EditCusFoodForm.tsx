const baseUrl = import.meta.env.VITE_BACKEND_URL;
import { type Dispatch, type SetStateAction } from "react";
import Form from "../ui/Form";
import useHttp from "../../hooks/useHttp";
import { Modal } from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useForm } from "../../hooks/useForm/useForm";
import useInput from "../../hooks/useInput";
import validator from "../../util/validator";
import ImageUpload from "../ui/ImageUpload";
import type React from "react";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../hooks/useModal";
import ErrorModal from "../ui/ErrorModal";
import Select from "../ui/Select";
import { useDiet } from "../../context/diet/DietManageContext";
import { useCustomizedFood } from "../../context/CustomizedFoodContext";
import { useFood } from "../../context/diet/FoodContext";

type EditCusFoodForm = {
  onCancel: () => void;
  setState: Dispatch<SetStateAction<"ex" | "food" | undefined>>;
};

const SelectItem = [
  "staple",
  "dairy",
  "protein",
  "vege",
  "oil",
  "nut",
  "other",
];

export default function EditCusFoodForm({
  onCancel,
  setState,
}: EditCusFoodForm) {
  const { foodId } = useFood();
  const { pool, updateFoodPool } = useCustomizedFood();
  if (!pool || !foodId || !pool[foodId]) {
    return <p className="p-4 text-center text-gray-500">No food selected.</p>;
  }
  const { setState: setDiet } = useDiet();
  const { formState, inputHandler } = useForm(
    {
      name: { value: pool[foodId].name, isValid: true },
      image: { value: "", isValid: true },
      kcal: { value: pool[foodId].kcal, isValid: true },
      carbon: { value: pool[foodId].carbon, isValid: true },
      protein: { value: pool[foodId].protein, isValid: true },
      fat: { value: pool[foodId].fat, isValid: true },
      type: { value: pool[foodId].type, isValid: true },
    },
    false
  );
  const { touched, blurHandler } = useInput();
  function clickCancelHandler() {
    setDiet("pool");
  }
  const { user, token } = useAuth();
  const { show, modalCancelHandler, modalDisplayHandler } = useModal();
  const { error, isLoading, sendRequest } = useHttp();
  async function submitImageHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let preSign;
    try {
      preSign = await sendRequest({
        url: `${baseUrl}/pool/${user?.userId}/food/preSign?contentType=${
          formState.inputs.image.value instanceof File
            ? formState.inputs.image.value.type
            : ""
        }`,
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      modalDisplayHandler();
      return;
    }

    try {
      const file = formState.inputs.image.value;
      if (!(file instanceof File)) throw new Error("No image selected");

      // PUT raw bytes to S3 using the presigned URL
      const putRes = await fetch(preSign!.uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type || "application/octet-stream" },
      });
      if (!putRes.ok) {
        const txt = await putRes.text().catch(() => "");
        throw new Error(`S3 upload failed (${putRes.status}): ${txt}`);
      }

      // Save your form fields + S3 key to your backend (JSON only)
      const responseData = await sendRequest({
        url: `${baseUrl}/pool/${user?.userId}/${foodId}/updateFood`,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: {
          name: formState.inputs.name.value,
          kcal: Number(formState.inputs.kcal.value),
          carbon: Number(formState.inputs.carbon.value),
          protein: Number(formState.inputs.protein.value),
          fat: Number(formState.inputs.fat.value),
          type: formState.inputs.type.value,
          imageUrl: preSign.fileUrl,
        },
      });
      updateFoodPool(responseData.updated);
      setDiet("pool");
    } catch (err) {
      modalDisplayHandler();
    }
  }

  async function submitNonImageHandler(e: React.FocusEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const responseData = await sendRequest({
        url: `${baseUrl}/pool/${user?.userId}/${foodId}/updateFood`,
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: {
          name: formState.inputs.name.value,
          kcal: Number(formState.inputs.kcal.value),
          carbon: Number(formState.inputs.carbon.value),
          protein: Number(formState.inputs.protein.value),
          fat: Number(formState.inputs.fat.value),
          type: formState.inputs.type.value,
        },
      });
      updateFoodPool(responseData.updated);
      setDiet("pool");
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
    <Modal onCancel={onCancel} setState={setState} size="w-[30%]">
      <Form
        title="Upload Customized Food"
        onSubmit={
          formState.inputs.image.value instanceof File
            ? submitImageHandler
            : submitNonImageHandler
        }
      >
        <div className="flex justify-between gap-6">
          <Input
            type="text"
            name="name"
            label="Food Name"
            value={String(formState.inputs.name.value)}
            onChange={(e) =>
              inputHandler(
                "name",
                e.target.value,
                validator("userName", e.target.value)
              )
            }
            isTouched={touched["name"]}
            onBlur={() => blurHandler("name")}
            isValid={formState.inputs.name.isValid}
            errMsg="Invalid Value"
          />

          <ImageUpload
            id="image"
            squareSizePx={150}
            onInput={inputHandler}
            image={pool[foodId].image}
          />
        </div>

        <Select
          name="type"
          label="Type"
          items={SelectItem}
          isTouched={touched["type"]}
          onBlur={() => blurHandler("type")}
          isValid={formState.inputs.type.isValid}
          value={
            typeof formState.inputs.type.value === "string"
              ? formState.inputs.type.value
              : ""
          }
          onChange={(e) =>
            inputHandler(
              "type",
              e.target.value,
              validator("type", e.target.value)
            )
          }
        />
        <Input
          type="number"
          name="kcal"
          label="Kcal"
          placeHolder="kcal per 100g"
          value={
            formState.inputs.kcal.value === ""
              ? ""
              : Number(formState.inputs.kcal.value)
          }
          onChange={(e) =>
            inputHandler(
              "kcal",
              Number(e.target.value),
              validator("kcal", e.target.value)
            )
          }
          isTouched={touched["kcal"]}
          onBlur={() => blurHandler("kcal")}
          isValid={formState.inputs.kcal.isValid}
          errMsg="Invalid Value"
        />
        <Input
          type="number"
          name="carbon"
          label="Carbon"
          placeHolder="carbon per 100g"
          value={
            formState.inputs.carbon.value === ""
              ? ""
              : Number(formState.inputs.carbon.value)
          }
          onChange={(e) =>
            inputHandler(
              "carbon",
              Number(e.target.value),
              validator("carbon", e.target.value)
            )
          }
          isTouched={touched["carbon"]}
          onBlur={() => blurHandler("carbon")}
          isValid={formState.inputs.carbon.isValid}
          errMsg="Invalid Value"
        />
        <Input
          type="number"
          name="protein"
          label="Protein"
          placeHolder="protein per 100g"
          value={
            formState.inputs.protein.value === ""
              ? ""
              : Number(formState.inputs.protein.value)
          }
          onChange={(e) =>
            inputHandler(
              "protein",
              Number(e.target.value),
              validator("protein", e.target.value)
            )
          }
          isTouched={touched["protein"]}
          onBlur={() => blurHandler("protein")}
          isValid={formState.inputs.protein.isValid}
          errMsg="Invalid Value"
        />
        <Input
          type="number"
          name="fat"
          label="Fat"
          placeHolder="fat per 100g"
          value={
            formState.inputs.fat.value === ""
              ? ""
              : Number(formState.inputs.fat.value)
          }
          onChange={(e) =>
            inputHandler(
              "fat",
              Number(e.target.value),
              validator("fat", e.target.value)
            )
          }
          isTouched={touched["fat"]}
          onBlur={() => blurHandler("fat")}
          isValid={formState.inputs.fat.isValid}
          errMsg="Invalid Value"
        />

        <div className="flex justify-end gap-4">
          <Button type="button" onClick={clickCancelHandler} kind="cancel">
            Cancel
          </Button>
          {isLoading ? (
            <Button kind="confirm" disabled>
              Loading...
            </Button>
          ) : (
            <Button kind="confirm" disabled={!formState.isValid || isLoading}>
              Confirm
            </Button>
          )}
        </div>
      </Form>
    </Modal>
  );
}
