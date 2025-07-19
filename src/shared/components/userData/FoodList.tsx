// import { useCategory } from "../../context/CategoryContext";
import { useDiet } from "../../context/DietManageContext";

import FoodGallery from "./FoodGallery";
import Button from "../ui/Button";

export default function FoodList() {
  // const {category, setCategory} = useCategory();
  const { setState } = useDiet();
  return (
    <div className="w-4/5 h-full p-5 flex flex-col justify-end">
      <div className="h-full">
        <FoodGallery />
      </div>
      <div className="flex justify-end">
        <Button kind="confirm" onClick={() => setState("manage")}>
          Back
        </Button>
      </div>
    </div>
  );
}
