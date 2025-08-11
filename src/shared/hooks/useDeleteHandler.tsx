const baseUrl = import.meta.env.VITE_BACKEND_URL;
import { useAuth } from "../context/AuthContext";
import { useUser } from "../context/UserContext/UserContext";
import useHttp from "./useHttp";
import { useEdit } from "../context/diet/EditContext";
import { useItem } from "../context/exercise/ItemContext";
import { useHisInfo } from "../context/useHisInfo";
import type { Info } from "../context/UserContext/UserContextType";

export default function useDietDelete(
  onCancel: () => void,
  modalDisplayHandler: () => void
) {
  let updateInfo: (updated: Info) => void;
  try {
    const object = useHisInfo();
    updateInfo = object.updateInfo;
  } catch (error) {
    const object = useUser();
    updateInfo = object.updateInfo;
  }
  const { item } = useItem();
  const { edit } = useEdit();
  const { user, token } = useAuth();
  const { error, isLoading, sendRequest } = useHttp();

  async function deleDietHandler(date: string) {
    try {
      const responseData = await sendRequest({
        url: `${baseUrl}/basic/${user?.userId}/${edit?.foodId}/deleteDiet`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        body: { meal: edit?.meal, isMain: edit?.isMain, date },
      });
      updateInfo(responseData.updated);
      onCancel();
    } catch (err) {
      modalDisplayHandler();
    }
  }

  async function deleteExerciseHandeler(eid: string, date: string) {
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
          date,
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
