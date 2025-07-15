import Button from "./Button";
import { Modal } from "./Modal";

type ResultModalProps = {
  title: string;
  msg: string;
  onCancel: () => void;
};

export default function ResultModal({
  title,
  msg,
  onCancel,
}: ResultModalProps) {
  return (
    <Modal onCancel={onCancel}>
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl">{title}</h2>
        <p>{msg}</p>
        <div className="flex justify-end">
          <Button kind="confirm" onClick={onCancel}>
            Explore
          </Button>
        </div>
      </div>
    </Modal>
  );
}
