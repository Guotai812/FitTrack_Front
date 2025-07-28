import { useDelete } from "../../../context/diet/DeleteContext";

import FoodEditForm from "../../form/diet/FoodEditForm";
import DeleteConfirm from "../../ui/DeleteConfirm";
import { Modal } from "../../ui/Modal";

type ModificationModalProps = {
  onCancel: () => void;
};

export default function ModificationModal({
  onCancel,
}: ModificationModalProps) {
  const { isDelete } = useDelete();
  return (
    <Modal onCancel={onCancel}>
      {isDelete ? (
        <DeleteConfirm onCancel={onCancel} />
      ) : (
        <FoodEditForm onCancel={onCancel} />
      )}
    </Modal>
  );
}
