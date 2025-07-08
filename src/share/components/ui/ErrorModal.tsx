import Button from "./Button";
import { Modal } from "./Modal";

type ErrorModal = {
  title: string;
  msg: string;
  onCancel: () => void;
};

export default function ErrorModal({ title, msg, onCancel }: ErrorModal) {
  return (
    <Modal onCancel={onCancel}>
      <h2>{title}</h2>
      <p>{msg}</p>
      <Button kind="cancel" onClick={onCancel}>
        Cancel
      </Button>
    </Modal>
  );
}
