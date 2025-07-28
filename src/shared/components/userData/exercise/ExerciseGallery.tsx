import { useCategory } from "../../../context/exercise/CategoryContext";
import { useExercise } from "../../../context/exercise/ExerciseContext";
import { usePool } from "../../../context/PoolConetext";
import Button from "../../ui/Button";

type ExerciseGalleryProps = {
  onCancel: () => void;
};

export default function ExerciseGallery({ onCancel }: ExerciseGalleryProps) {
  const { id, setId } = useExercise();
  const { category } = useCategory();
  const { ePool } = usePool();

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
      <div className="flex justify-end">
        <Button kind="cancel" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
