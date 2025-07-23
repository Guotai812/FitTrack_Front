import { useCategory } from "../../../context/CategoryContext";
import { useDiet } from "../../../context/DietManageContext";
import { useFood } from "../../../context/FoodContext";
import { usePool } from "../../../context/PoolConetext";
import Button from "../../ui/Button";

export default function FoodGallery() {
  const { setFoodId } = useFood();
  const { setState } = useDiet();
  const { category } = useCategory();
  const { pool } = usePool();

  if (!pool || Object.keys(pool).length === 0) {
    return <p className="p-4 text-center text-gray-500">No items available.</p>;
  }

  let items = Object.values(pool);
  switch (category) {
    case "all":
      break;
    case "staple":
    case "dairy":
    case "protein":
    case "vege":
    case "oil":
    case "nut":
      items = items.filter((item) => item.type === category);
      break;

    case "others":
      items = items.filter(
        (item) =>
          !["staple", "dairy", "protein", "vege", "oil", "nut"].includes(
            item.type
          )
      );
      break;

    default:
      items = [];
  }

  function recordFoodIdHandler(id: string) {
    setFoodId(id);
    setState("add");
  }
  return (
    <>
      <div className="h-full overflow-auto">
        <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <li key={item._id}>
              <Button
                onClick={() => {
                  recordFoodIdHandler(item._id);
                }}
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
    </>
  );
}
