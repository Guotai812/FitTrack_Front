const baseUrl = import.meta.env.VITE_BACKEND_URL;
import { useEffect } from "react";
import { useCustomizedExContext } from "../../../context/CustomizedExContext";
import { useCategory } from "../../../context/exercise/CategoryContext";
import { useExercise } from "../../../context/exercise/ExerciseContext";
import Button from "../../ui/Button";
import type { Epool } from "../../../context/PoolConetext";
import useHttp from "../../../hooks/useHttp";
import { useAuth } from "../../../context/AuthContext";

type ExerciseGalleryProps = {
  onCancel: () => void;
  setState: React.Dispatch<React.SetStateAction<"ex" | "food" | undefined>>; // Optional prop for state management
};

export default function ExerciseGallery({
  onCancel,
  setState,
}: ExerciseGalleryProps) {
  const { user, token } = useAuth();
  const { setId } = useExercise();
  const { category } = useCategory();
  const { ePool, updateEpool } = useCustomizedExContext();
  const { sendRequest } = useHttp<{ msg: string; data: Epool }>();
  useEffect(() => {
    async function fetchEpool() {
      try {
        const responseData = await sendRequest({
          url: `${baseUrl}/pool/${user?.userId}/getCusEpool`,
          headers: { Authorization: `Bearer ${token}` },
        });
        updateEpool(responseData.data);
      } catch (err) {}
    }
    fetchEpool();
  }, []);

  if (!ePool || Object.keys(ePool).length === 0) {
    return <p className="p-4 text-center text-gray-500">No items available.</p>;
  }

  let items = Object.values(ePool);
  switch (category.top) {
    case "all":
      break;
    case "aerobic":
      items = items.filter((item) => item.type === category.top);
      break;
    case "anaerobic":
      items = items.filter((item) => item.type === category.top);
      switch (category.sub) {
        case "chest":
        case "back":
        case "leg":
          items = items.filter((item) => item.subType === category.sub);
          break;
        case "other":
          items = items.filter(
            (item) => !["chest", "back", "leg"].includes(item.subType)
          );
          break;
      }
      break;
    default:
      items = [];
  }

  function clickCancelHandler() {
    onCancel();
    setState(undefined);
  }

  return (
    <div className="w-5/6 h-full p-6 flex flex-col justify-end">
      <div className="h-full overflow-y-auto ">
        <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <li key={item._id}>
              <Button
                onClick={() => setId(item._id)}
                className="flex flex-col items-center justify-center w-32 h-40 bg-white rounded-lg shadow hover:shadow-xl hover:bg-green-300 transition-shadow"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-full object-cover mb-2"
                />
                <span className="text-sm font-medium text-gray-800 text-center">
                  {item.name}
                </span>
              </Button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-end gap-4">
        <Button kind="cancel" onClick={clickCancelHandler}>
          Cancel
        </Button>
        <Button kind="confirm">Upload</Button>
      </div>
    </div>
  );
}
