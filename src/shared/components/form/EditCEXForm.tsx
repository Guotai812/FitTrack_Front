import { useCustomizedExContext } from "../../context/CustomizedExContext";
import { useExercise } from "../../context/exercise/ExerciseContext";
import { Modal } from "../ui/Modal";
import Button from "../ui/Button";
import Form from "../ui/Form";
import { useForm } from "../../hooks/useForm/useForm";
import useInput from "../../hooks/useInput";
import Input from "../ui/Input";
import validator from "../../util/validator";
import ImageUpload from "../ui/ImageUpload";
import { useState } from "react";
import Select from "../ui/Select";

export default function EditCEXForm() {
  const { id, setId } = useExercise();
  const { ePool, updateEpool } = useCustomizedExContext();
  if (!ePool || !id || !ePool[id]) {
    return <p className="p-4 text-center text-gray-500">No food selected.</p>;
  }
  const exercise = ePool ? ePool[id] : null;
  const type = exercise ? exercise.type : "";
  const { inputHandler: aerobicHandler, formState: aerobicState } = useForm(
    {
      name: { value: String(exercise?.name), isValid: true },
      image: { value: String(exercise?.image), isValid: true },
      met: { value: Number(exercise?.met), isValid: true },
      kcalPerHour: { value: Number(exercise?.kcalPerHour), isValid: true },
    },
    true
  );
  const { inputHandler: anaerobicHandler, formState: anaerobicState } = useForm(
    {
      name: { value: String(exercise?.name), isValid: true },
      image: { value: String(exercise?.name), isValid: true },
      rom: { value: Number(exercise?.defaultRom), isValid: true },
      efficency: { value: Number(exercise?.efficiency), isValid: true },
      subType: { value: String(exercise?.subType), isValid: true },
      buffer: { value: Number(exercise?.buffer), isValid: true },
    },
    true
  );
  const { touched, blurHandler } = useInput();
  const { touched: anaTouched, blurHandler: anaBlurHanlder } = useInput();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      <ImageUpload
        id="image"
        squareSizePx={150}
        onInput={aerobicHandler}
        image={ePool[id].image}
      />
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
      <ImageUpload
        id="image"
        squareSizePx={150}
        onInput={anaerobicHandler}
        image={ePool[id].image}
      />
      <Select
        label="Target Muscle"
        name="subType"
        items={["Leg", "Chest", "Back", "Other"]}
        value={String(anaerobicState.inputs.subType.value)}
        isTouched={anaTouched["subType"]}
        onBlur={() => anaBlurHanlder("subType")}
        isValid={anaerobicState.inputs.subType.isValid}
        onChange={(e) =>
          anaerobicHandler(
            "subType",
            e.target.value,
            validator("type", e.target.value)
          )
        }
      />
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

  function onCancel() {
    setId("");
  }
  function isChanged() {
    if (!ePool || !id || !ePool[id]) return false;
    const ex = ePool[id];
    if (type === "aerobic") {
      return (
        ex.name !== aerobicState.inputs.name.value ||
        ex.met !== Number(aerobicState.inputs.met.value) ||
        ex.kcalPerHour !== Number(aerobicState.inputs.kcalPerHour.value) ||
        (aerobicState.inputs.image.value instanceof File &&
          aerobicState.inputs.image.value.name !== ex.image)
      );
    } else {
      return (
        ex.name !== anaerobicState.inputs.name.value ||
        ex.subType !== anaerobicState.inputs.subType.value ||
        ex.defaultRom !== Number(anaerobicState.inputs.rom.value) ||
        ex.efficiency !== Number(anaerobicState.inputs.efficency.value) ||
        ex.buffer !== Number(anaerobicState.inputs.buffer.value) ||
        (anaerobicState.inputs.image.value instanceof File &&
          anaerobicState.inputs.image.value.name !== ex.image)
      );
    }
  }
  return (
    <Modal onCancel={onCancel}>
      <Form>
        {type === "aerobic" ? aerobicForm : anaerobicForm}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            kind="cancel"
            onClick={() => {
              setId("");
            }}
          >
            Cancel
          </Button>
          <Button
            kind="confirm"
            disabled={
              (type === "aerobic"
                ? !aerobicState.isValid
                : !anaerobicState.isValid) ||
              isLoading ||
              !isChanged()
            }
          >
            Upload
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
