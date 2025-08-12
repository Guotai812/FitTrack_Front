import type { Dispatch, SetStateAction } from "react";
import Form from "../ui/Form";
import { Modal } from "../ui/Modal";

type UpLoadExFormProps = {
  onCancel: () => void;
  setState: Dispatch<SetStateAction<"ex" | "food" |  undefined>>;
};

export default function UpLoadExForm({
  onCancel,
  setState,
}: UpLoadExFormProps) {
  return (
    <Modal onCancel={onCancel} setState={setState} >
      <Form>as</Form>
    </Modal>
  );
}
