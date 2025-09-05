const baseUrl = import.meta.env.VITE_BACKEND_URL;
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
import useHttp from "../../hooks/useHttp";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../hooks/useModal";
import ErrorModal from "../ui/ErrorModal";
import Select from "../ui/Select";

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
  const { user, token } = useAuth();
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
      subtype: { value: "", isValid: false },
      buffer: { value: 1.15, isValid: true },
    },
    false
  );
  const { touched, blurHandler } = useInput();
  const { touched: anaTouched, blurHandler: anaBlurHanlder } = useInput();
  const { sendRequest, error } = useHttp();
  const { show, modalCancelHandler, modalDisplayHandler } = useModal();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onSubmitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let preSign;
    if (isAerobic) {
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
          url: `${baseUrl}/pool/${user?.userId}/uploadAerobic`,
          method: "POST",
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
        setIsUpload(false);
        setIsLoading(false);
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
          url: `${baseUrl}/pool/${user?.userId}/uploadAnaerobic`,
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: {
            name: anaerobicState.inputs.name.value,
            rom: Number(anaerobicState.inputs.rom.value),
            efficency: Number(anaerobicState.inputs.efficency.value),
            buffer: Number(anaerobicState.inputs.buffer.value),
            type: "anaerobic",
            subType: anaerobicState.inputs.subtype.value,
            imageUrl: preSign.fileUrl,
          },
        });
      } catch (err) {
        modalDisplayHandler();
      } finally {
        setIsUpload(false);
        setIsLoading(false);
        // location.reload();
      }
    }
  }

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
      <Select
        label="Target Muscle"
        name="subtype"
        items={["Leg", "Chest", "Back", "Other"]}
        value={String(anaerobicState.inputs.subtype.value)}
        isTouched={anaTouched["subtype"]}
        onBlur={() => anaBlurHanlder("subtype")}
        isValid={anaerobicState.inputs.subtype.isValid}
        onChange={(e) =>
          anaerobicHandler(
            "subtype",
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

  if (show && error) {
    return (
      <ErrorModal onCancel={modalCancelHandler} msg={error} title="Error" />
    );
  }
  return (
    <Modal onCancel={onCancel} setState={setState}>
      <Form onSubmit={onSubmitHandler}>
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
            type="button"
            kind="cancel"
            onClick={() => {
              setIsUpload(false);
            }}
          >
            Cancel
          </Button>
          <Button
            kind="confirm"
            disabled={
              isAerobic
                ? !aerobicState.isValid
                : !anaerobicState.isValid || isLoading
            }
          >
            Upload
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
