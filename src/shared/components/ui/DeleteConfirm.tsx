const baseUrl = import.meta.env.VITE_BACKEND_URL;
import { Weight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useDelete } from "../../context/DeleteContext";
import { useEdit } from "../../context/EditContext";
import { useUser } from "../../context/UserContext";
import useHttp from "../../hooks/useHttp";
import { useModal } from "../../hooks/useModal";
import { usePool } from "../../context/PoolConetext";

import Button from "./Button";
import ErrorModal from "./ErrorModal";

type DeleteConfirmProps = {
  onCancel: () => void;
};

export default function DeleteConfirm({ onCancel }: DeleteConfirmProps) {
  const { pool } = usePool();
  const { info, updateInfo } = useUser();
  const { edit } = useEdit();
  const { user, token } = useAuth();
  const { error, isLoading, sendRequest } = useHttp();
  const { setIsDelete } = useDelete();
  const { show, modalCancelHandler, modalDisplayHandler } = useModal();

  async function deleteHandler() {
    const mealKey = edit?.meal ?? "breakfast";
    const listKey = edit?.isMain ? "main" : "extra";
    const found = info.diets[mealKey][listKey].find(
      (item) => item.food === edit?.foodId
    );
    const weight = found?.weight ?? 0;
    const kcalRaw = (pool[edit?.foodId ?? ""].kcal / 100) * weight;
    const kcal = Math.round(kcalRaw * 10) / 10;
    try {
      const responseData = await sendRequest({
        url: `${baseUrl}/basic/${user?.userId}/${edit?.foodId}/deleteDiet`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        body: { meal: edit?.meal, isMain: edit?.isMain, kcal },
      });
      updateInfo(responseData.updated);
      onCancel();
    } catch (err) {
      modalDisplayHandler();
    }
  }

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
        <Button kind="cancel" onClick={deleteHandler} disabled={isLoading}>
          Delete
        </Button>
      </div>
    </div>
  );
}
