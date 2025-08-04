const baseUrl = import.meta.env.VITE_BACKEND_URL;
import { useAuth } from "../context/AuthContext";
import { useUser } from "../context/UserContext/UserContext";
import { usePool } from "../context/PoolConetext";
import useHttp from "./useHttp";
import { useEdit } from "../context/diet/EditContext";
import { useItem } from "../context/exercise/ItemContext";

export default function useDietDelete(
  onCancel: () => void,
  modalDisplayHandler: () => void
) {
  const { pool } = usePool();
  const { item } = useItem();
  const { info, updateInfo } = useUser();
  const { edit } = useEdit();
  const { user, token } = useAuth();
  const { error, isLoading, sendRequest } = useHttp();

  async function deleDietHandler() {
    const mealKey = edit?.meal ?? "breakfast";
    const listKey = edit?.isMain ? "main" : "extra";
    const found = info.diets[mealKey][listKey].find(
      (item) => item.food === edit?.foodId
    );
    const weight = found?.weight ?? 0;
    const kcal = (pool[edit?.foodId ?? ""].kcal / 100) * weight;
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

  async function deleteExerciseHandeler(eid: string) {
    try {
      const responseData = await sendRequest({
        url: `${baseUrl}/basic/${user?.userId}/deleteExercise`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        body: {
          rid: item.rid,
          type: item.type,
          eid: eid,
          kcal: item.kcal,
        },
      });
      updateInfo(responseData.updated);
      onCancel();
    } catch (err) {
      modalDisplayHandler();
    }
  }

  return { deleDietHandler, error, isLoading, deleteExerciseHandeler };
}
