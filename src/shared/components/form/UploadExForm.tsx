import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { Modal } from "../ui/Modal";
import Form from "../ui/Form";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useForm } from "../../hooks/useForm/useForm";
import validator from "../../util/validator";
import useInput from "../../hooks/useInput";
import ImageUpload from "../ui/ImageUpload";

type UpLoadExFormProps = {
  onCancel: () => void;
  setState: Dispatch<SetStateAction<"ex" | "food" | undefined>>;
  setIsUpload: Dispatch<SetStateAction<boolean>>; // Optional prop for state management
};

export default function UpLoadExForm({
  onCancel,
  setState,
  setIsUpload,
}: UpLoadExFormProps) {
  const [isAerobic, setIsAerobic] = useState<boolean>(true);

  const { inputHandler: aerobicHandler, formState: aerobicState } = useForm(
    {
      name: { value: "", isValid: false },
      image: { value: "", isValid: false },
      met: { value: 0, isValid: false },
      kcalPerHour: { value: 0, isValid: false },
    },
    false
  );
  const { inputHandler: anaerobicHandler, formState: anaerobicState } = useForm(
    {
      name: { value: "", isValid: false },
      image: { value: "", isValid: false },
      rom: { value: 0.5, isValid: true },
      efficency: { value: 0.2, isValid: true },
      buffer: { value: 1.15, isValid: true },
    },
    false
  );
  const { touched, blurHandler } = useInput();
  const { touched: anaTouched, blurHandler: anaBlurHanlder } = useInput();

  const aerobicForm = (
    <>
      <Input
        type="text"
        label="Name"
        name="name"
        value={String(aerobicState.inputs.name.value)}
        onChange={(e) =>
          aerobicHandler(
            "name",
            e.target.value,
            validator("name", e.target.value)
          )
        }
        isTouched={touched["name"]}
        onBlur={() => blurHandler("name")}
        isValid={aerobicState.inputs.name.isValid}
        errMsg="Please enter valid name"
      />
      <ImageUpload id="image" squareSizePx={150} onInput={aerobicHandler} />
      <Input
        type="number"
        label="Met"
        name="met"
        value={Number(aerobicState.inputs.met.value)}
        onChange={(e) =>
          aerobicHandler(
            "met",
            e.target.value,
            validator("met", e.target.value)
          )
        }
        isTouched={touched["met"]}
        onBlur={() => blurHandler("met")}
        isValid={aerobicState.inputs.met.isValid}
        errMsg="Please enter valid met"
      />
      <Input
        type="number"
        label="Kcal Per Hour"
        name="kcalPerHour"
        value={String(aerobicState.inputs.kcalPerHour.value)}
        onChange={(e) =>
          aerobicHandler(
            "kcalPerHour",
            e.target.value,
            validator("kcalPerHour", e.target.value)
          )
        }
        isTouched={touched["kcalPerHour"]}
        onBlur={() => blurHandler("kcalPerHour")}
        isValid={aerobicState.inputs.kcalPerHour.isValid}
        errMsg="Please enter valid kcalPerHour"
      />
    </>
  );
  const anaerobicForm = (
    <>
      <Input
        type="text"
        label="Name"
        name="name"
        value={String(anaerobicState.inputs.name.value)}
        onChange={(e) =>
          anaerobicHandler(
            "name",
            e.target.value,
            validator("name", e.target.value)
          )
        }
        isTouched={anaTouched["name"]}
        onBlur={() => anaBlurHanlder("name")}
        isValid={anaerobicState.inputs.name.isValid}
        errMsg="Please enter valid name"
      />
      <ImageUpload id="image" squareSizePx={150} onInput={anaerobicHandler} />
      <Input
        type="number"
        label="Rom"
        name="rom"
        value={Number(anaerobicState.inputs.rom.value)}
        onChange={(e) =>
          anaerobicHandler(
            "rom",
            e.target.value,
            validator("rom", e.target.value)
          )
        }
        isTouched={anaTouched["rom"]}
        onBlur={() => anaBlurHanlder("rom")}
        isValid={anaerobicState.inputs.rom.isValid}
        errMsg="Please enter valid rom"
      />
      <Input
        type="number"
        label="Efficency"
        name="efficency"
        value={String(anaerobicState.inputs.efficency.value)}
        onChange={(e) =>
          anaerobicHandler(
            "efficency",
            e.target.value,
            validator("efficency", e.target.value)
          )
        }
        isTouched={anaTouched["efficency"]}
        onBlur={() => anaBlurHanlder("efficency")}
        isValid={anaerobicState.inputs.efficency.isValid}
        errMsg="Please enter valid efficency"
      />
       <Input
        type="number"
        label="Buffer"
        name="buffer"
        value={String(anaerobicState.inputs.buffer.value)}
        onChange={(e) =>
          anaerobicHandler(
            "buffer",
            e.target.value,
            validator("buffer", e.target.value)
          )
        }
        isTouched={anaTouched["buffer"]}
        onBlur={() => anaBlurHanlder("buffer")}
        isValid={anaerobicState.inputs.buffer.isValid}
        errMsg="Please enter valid buffer"
      />
    </>
  );

  return (
    <Modal onCancel={onCancel} setState={setState}>
      <Form>
        <div className="flex justify-center gap-4 mb-4">
          <Button
            type="button"
            kind="confirm"
            onClick={() => setIsAerobic(true)}
            className={isAerobic ? "bg-green-300 text-white" : ""}
          >
            Aerobic
          </Button>
          <Button
            type="button"
            kind="confirm"
            onClick={() => setIsAerobic(false)}
            className={isAerobic ? "" : "bg-green-300 text-white"}
          >
            Anaerobic
          </Button>
        </div>
        {isAerobic ? aerobicForm : anaerobicForm}
        <div className="flex justify-end gap-4">
          <Button
            kind="cancel"
            onClick={() => {
              setIsUpload(false);
            }}
          >
            Cancel
          </Button>
          <Button type="button" kind="confirm" disabled={!aerobicState.isValid}>
            Upload
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
