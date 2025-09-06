const baseUrl = import.meta.env.VITE_BACKEND_URL;
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
import useHttp from "../../hooks/useHttp";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../hooks/useModal";
import ErrorModal from "../ui/ErrorModal";

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
  const { sendRequest, error } = useHttp();
  const { user, token } = useAuth();
  const { show, modalDisplayHandler, modalCancelHandler } = useModal();

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

  async function submitImageHandler(e: React.FormEvent) {
    e.preventDefault();
    let preSign;
    if (type === "aerobic") {
      setIsLoading(true);
      try {
        preSign = await sendRequest({
          url: `${baseUrl}/pool/${user?.userId}/exercise/preSign?contentType=${
            aerobicState.inputs.image.value instanceof File
              ? aerobicState.inputs.image.value.type
              : ""
          }`,
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        modalDisplayHandler();
        return;
      }
      try {
        const file = aerobicState.inputs.image.value;
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
        await sendRequest({
          url: `${baseUrl}/pool/${user?.userId}/updateCusExercise/${id}`,
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: {
            name: aerobicState.inputs.name.value,
            met: Number(aerobicState.inputs.met.value),
            kcalPerHour: Number(aerobicState.inputs.kcalPerHour.value),
            type: "aerobic",
            imageUrl: preSign.fileUrl,
          },
        });
      } catch (err) {
        modalDisplayHandler();
      } finally {
        setIsLoading(false);
        setId("");
        // location.reload();
      }
    } else {
      setIsLoading(true);
      try {
        preSign = await sendRequest({
          url: `${baseUrl}/pool/${user?.userId}/exercise/preSign?contentType=${
            anaerobicState.inputs.image.value instanceof File
              ? anaerobicState.inputs.image.value.type
              : ""
          }`,
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        modalDisplayHandler();
        return;
      }

      try {
        const file = anaerobicState.inputs.image.value;
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
        await sendRequest({
          url: `${baseUrl}/pool/${user?.userId}/updateCusExercise/${id}`,
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          body: {
            name: anaerobicState.inputs.name.value,
            rom: Number(anaerobicState.inputs.rom.value),
            efficency: Number(anaerobicState.inputs.efficency.value),
            buffer: Number(anaerobicState.inputs.buffer.value),
            type: "anaerobic",
            subType: anaerobicState.inputs.subType.value,
            imageUrl: preSign.fileUrl,
          },
        });
      } catch (err) {
        modalDisplayHandler();
      } finally {
        setIsLoading(false);
        setId("");
        // location.reload();
      }
    }
  }

  async function submitNonImageHandler(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const body =
        type === "aerobic"
          ? {
              name: aerobicState.inputs.name.value,
              image:
                aerobicState.inputs.image.value instanceof File
                  ? aerobicState.inputs.image.value.name
                  : aerobicState.inputs.image.value,
              met: Number(aerobicState.inputs.met.value),
              kcalPerHour: Number(aerobicState.inputs.kcalPerHour.value),
            }
          : {
              name: anaerobicState.inputs.name.value,
              image:
                anaerobicState.inputs.image.value instanceof File
                  ? anaerobicState.inputs.image.value.name
                  : anaerobicState.inputs.image.value,
              subType: anaerobicState.inputs.subType.value,
              defaultRom: Number(anaerobicState.inputs.rom.value),
              efficiency: Number(anaerobicState.inputs.efficency.value),
              buffer: Number(anaerobicState.inputs.buffer.value),
            };
      const responseData = await sendRequest({
        url: `${baseUrl}/pool/${user?.userId}/updateCusExercise/${id}`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body,
      });
      updateEpool(responseData.data);
      setId("");
    } catch (err) {
      console.log(err);
      modalDisplayHandler();
    }
    setIsLoading(false);
  }
  if (error && show) {
    return (
      <ErrorModal title="Failed!" msg={error} onCancel={modalCancelHandler} />
    );
  }

  return (
    <Modal onCancel={onCancel}>
      <Form
        onSubmit={
          anaerobicState.inputs.image.value instanceof File ||
          aerobicState.inputs.image.value instanceof File
            ? submitImageHandler
            : submitNonImageHandler
        }
      >
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
