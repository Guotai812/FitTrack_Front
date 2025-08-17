import { useCategory } from "../../../context/diet/CategoryContext";
import { useDiet } from "../../../context/diet/DietManageContext";
import Button from "../../ui/Button";

type Category =
  | "all"
  | "staple"
  | "dairy"
  | "protein"
  | "vege"
  | "fruit"
  | "nut"
  | "oil"
  | "others";

export default function LibraryNavigation() {
  const { category, setCategory } = useCategory();
  const { setState } = useDiet();
  function categoryHandler(category: Category) {
    setState("pool");
    setCategory(category);
  }
  return (
    <aside className="bg-green-300 h-full w-1/6 flex justify-center items-center">
      <nav>
        <ol className="flex flex-col justify-between items-center gap-6">
          <li>
            <Button
              className="hover:text-white"
              onClick={() => categoryHandler("all")}
            >
              All
            </Button>
          </li>
          <li>
            <Button
              className={`hover:text-white ${
                category === "staple" ? "text-white" : ""
              }`}
              onClick={() => categoryHandler("staple")}
            >
              Staple food
            </Button>
          </li>
          <li>
            <Button
              className={`hover:text-white ${
                category === "dairy" ? "text-white" : ""
              }`}
              onClick={() => categoryHandler("dairy")}
            >
              Dairy
            </Button>
          </li>
          <li>
            <Button
              className={`hover:text-white ${
                category === "protein" ? "text-white" : ""
              }`}
              onClick={() => categoryHandler("protein")}
            >
              Protein
            </Button>
          </li>
          <li>
            <Button
              className={`hover:text-white ${
                category === "vege" ? "text-white" : ""
              }`}
              onClick={() => categoryHandler("vege")}
            >
              Vegetable
            </Button>
          </li>
          <li>
            <Button
              className={`hover:text-white ${
                category === "fruit" ? "text-white" : ""
              }`}
              onClick={() => categoryHandler("fruit")}
            >
              Fruit
            </Button>
          </li>
          <li>
            <Button
              className={`hover:text-white ${
                category === "oil" ? "text-white" : ""
              }`}
              onClick={() => categoryHandler("oil")}
            >
              Oil
            </Button>
          </li>
          <li>
            <Button
              className={`hover:text-white ${
                category === "nut" ? "text-white" : ""
              }`}
              onClick={() => categoryHandler("nut")}
            >
              Nut
            </Button>
          </li>
          <li>
            <Button
              className={`hover:text-white ${
                category === "others" ? "text-white" : ""
              }`}
              onClick={() => categoryHandler("others")}
            >
              Other
            </Button>
          </li>
        </ol>
      </nav>
    </aside>
  );
}
