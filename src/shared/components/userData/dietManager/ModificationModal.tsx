import FoodEditForm from "../../form/FoodEditForm";
import { Modal } from "../../ui/Modal";

type ModificationModalProps = {
  onCancel: () => void;
};

export default function ModificationModal({
  onCancel,
}: ModificationModalProps) {
  return (
    <Modal onCancel={onCancel}>
      <FoodEditForm onCancel={onCancel} />
    </Modal>
  );
}
