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
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl">{title}</h2>
        <p>{msg}</p>
        <div className="flex justify-end">
          <Button kind="cancel" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
