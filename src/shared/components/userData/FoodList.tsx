import { useDiet } from "../../context/DietManageContext";

import FoodGallery from "./FoodGallery";
import Button from "../ui/Button";

export default function FoodList() {
  const { setState } = useDiet();
  return (
    <div className="w-4/5 h-full p-6 flex flex-col justify-end">
      <FoodGallery />
      <div className="flex justify-end">
        <Button kind="confirm" onClick={() => setState("manage")}>
          Back
        </Button>
      </div>
    </div>
  );
}
