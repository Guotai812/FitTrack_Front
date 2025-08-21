import type { Dispatch, SetStateAction } from "react";

import { Modal } from "../ui/Modal";
import Form from "../ui/Form";

type UpLoadExFormProps = {
  onCancel: () => void;
  setState: Dispatch<SetStateAction<"ex" | "food" | undefined>>;
};

export default function UpLoadExForm({
  onCancel,
  setState,
}: UpLoadExFormProps) {
  return (
    <Modal onCancel={onCancel} setState={setState} pad={0}>
      <Form>
        <div>asd</div>
      </Form>
    </Modal>
  );
}
