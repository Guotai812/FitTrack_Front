import type { AerobicItem } from "../../context/UserContext/UserContextType";
import { useDelete } from "../../context/diet/DeleteContext";
import { useModal } from "../../hooks/useModal";

import Button from "./Button";
import ErrorModal from "./ErrorModal";
import useDietDelete from "../../hooks/useDeleteHandler";

type DeleteConfirmProps = {
  onCancel: () => void;
  type: "diet" | "exercise";
  eid?: string;
};

export default function DeleteConfirm({
  onCancel,
  type,
  eid = "",
}: DeleteConfirmProps) {
  const { setIsDelete } = useDelete();
  const { show, modalCancelHandler, modalDisplayHandler } = useModal();
  const { deleDietHandler, error, isLoading, deleteExerciseHandeler } =
    useDietDelete(onCancel, modalDisplayHandler);

  if (show && error) {
    <ErrorModal
      onCancel={modalCancelHandler}
      title="Error"
      msg="Somthing went wrong"
    />;
  }
  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-xl">Warning</h2>
        <p>Are you sure you want to delete this item, it is unwithrawable!</p>
      </div>

      <div className="flex justify-between gap-4">
        <Button kind="gray" onClick={() => setIsDelete(false)}>
          Cancel
        </Button>
        <Button
          kind="cancel"
          onClick={
            type === "diet"
              ? deleDietHandler
              : () => deleteExerciseHandeler(eid)
          }
          disabled={isLoading}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
