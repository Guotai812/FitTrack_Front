import { useCategory } from "../../context/CategoryContext";
import Button from "../ui/Button";

export default function LibraryNavigation() {
  const { category, setCategory } = useCategory();
  return (
    <aside className="bg-green-300 h-full w-1/5 flex justify-center items-center">
      <nav>
        <ol className="flex flex-col justify-between items-center gap-6">
          <li>
            <Button
              className="hover:text-white"
              onClick={() => setCategory("all")}
            >
              All
            </Button>
          </li>
          <li>
            <Button
              className={`hover:text-white ${
                category === "staple" ? "text-white" : ""
              }`}
              onClick={() => setCategory("staple")}
            >
              Staple food
            </Button>
          </li>
          <li>
            <Button
              className={`hover:text-white ${
                category === "dairy" ? "text-white" : ""
              }`}
              onClick={() => setCategory("dairy")}
            >
              Dairy
            </Button>
          </li>
          <li>
            <Button
              className={`hover:text-white ${
                category === "protein" ? "text-white" : ""
              }`}
              onClick={() => setCategory("protein")}
            >
              Protein
            </Button>
          </li>
          <li>
            <Button
              className={`hover:text-white ${
                category === "vege" ? "text-white" : ""
              }`}
              onClick={() => setCategory("vege")}
            >
              Vegetable
            </Button>
          </li>
          <li>
            <Button
              className={`hover:text-white ${
                category === "oil" ? "text-white" : ""
              }`}
              onClick={() => setCategory("oil")}
            >
              Oil
            </Button>
          </li>
          <li>
            <Button
              className={`hover:text-white ${
                category === "nut" ? "text-white" : ""
              }`}
              onClick={() => setCategory("nut")}
            >
              Nut
            </Button>
          </li>
          <li>
            <Button
              className={`hover:text-white ${
                category === "others" ? "text-white" : ""
              }`}
              onClick={() => setCategory("others")}
            >
              Other
            </Button>
          </li>
        </ol>
      </nav>
    </aside>
  );
}
