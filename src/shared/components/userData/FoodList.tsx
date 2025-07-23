import { useMeal } from "../../context/MealContext";

import FoodGallery from "./FoodGallery";
import Button from "../ui/Button";

export default function FoodList({ onCancel }: { onCancel: () => void }) {
  const { meal, setMeal } = useMeal();

  return (
    <div className="w-5/6 h-full p-6 flex flex-col justify-end">
      <FoodGallery />
      <div className="flex justify-between">
        <div className="flex justify-end gap-4">
          <Button
            className={`hover:bg-green-300 hover:text-white rounded w-20 h-10 rounded ${
              meal === "breakfast" ? "bg-green-300 text-white" : ""
            }`}
            onClick={() => {
              setMeal("breakfast");
            }}
          >
            Breakfast
          </Button>
          <Button
            className={`hover:bg-green-300 hover:text-white rounded w-20 h-10 rounded ${
              meal === "lunch" ? "bg-green-300 text-white" : ""
            }`}
            onClick={() => {
              setMeal("lunch");
            }}
          >
            Lunch
          </Button>
          <Button
            className={`hover:bg-green-300 hover:text-white rounded w-20 h-10 rounded ${
              meal === "dinner" ? "bg-green-300 text-white" : ""
            }`}
            onClick={() => {
              setMeal("dinner");
            }}
          >
            Dinner
          </Button>
        </div>
        <Button kind="cancel" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
