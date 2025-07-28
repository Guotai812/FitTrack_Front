import { useDiet } from "../../../context/diet/DietManageContext";

import { MealContextProvider } from "../../../context/diet/MealContext";
import LibraryNavigation from "./LibraryNavigation";
import FoodList from "./FoodList";
import FoodForm from "../../form/diet/FoodForm";
import { FoodContextProvider } from "../../../context/diet/FoodContext";

export default function FoodLibrary({ onCancel }: { onCancel: () => void }) {
  const { state } = useDiet();
  return (
    <FoodContextProvider>
      <div className="flex justify-between h-full">
        <LibraryNavigation />
        <MealContextProvider>
          {state === "pool" ? <FoodList onCancel={onCancel} /> : <FoodForm />}
        </MealContextProvider>
      </div>
    </FoodContextProvider>
  );
}
