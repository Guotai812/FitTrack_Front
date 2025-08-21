import type { Dispatch, SetStateAction } from "react";

import { Modal } from "../ui/Modal";
import Form from "../ui/Form";

type UpLoadExFormProps = {
  onCancel: () => void;
  setState: Dispatch<SetStateAction<"ex" | "food" | undefined>>;
  setIsUpload: Dispatch<SetStateAction<boolean>>; // Optional prop for state management
};

// TODO: Implement the upload functionality
export default function UpLoadExForm({
  onCancel,
  setState,
  setIsUpload,
}: UpLoadExFormProps) {
  return (
    <Modal onCancel={onCancel} setState={setState} pad={0}>
      <Form>
        <button type="button" onClick={() => setIsUpload(false)}>
          asd
        </button>
      </Form>
    </Modal>
  );
}
