import { useDelete } from "../../../../context/diet/DeleteContext";
import { useHisInfo } from "../../../../context/useHisInfo";

import FoodEditForm from "../../../form/his/diets/FoodEditForm";
import DeleteConfirm from "../../../ui/DeleteConfirm";
import { Modal } from "../../../ui/Modal";

type ModificationModalProps = {
  onCancel: () => void;
};

export default function ModificationModal({
  onCancel,
}: ModificationModalProps) {
  const { info } = useHisInfo();
  const { isDelete } = useDelete();
  return (
    <Modal onCancel={onCancel}>
      {isDelete ? (
        <DeleteConfirm onCancel={onCancel} type="diet" date={info.date} />
      ) : (
        <FoodEditForm onCancel={onCancel} />
      )}
    </Modal>
  );
}
