import type { Dispatch, SetStateAction } from "react";
import Form from "../ui/Form";
import { Modal } from "../ui/Modal";

type UpLoadFoodFormProps = {
  onCancel: () => void;
  setState: Dispatch<SetStateAction<"ex" | "food" | undefined>>;
};

export default function UpLoadFoodForm({
  onCancel,
  setState,
}: UpLoadFoodFormProps) {
  return (
    <Modal onCancel={onCancel} setState={setState}>
      <Form>asd</Form>
    </Modal>
  );
}
