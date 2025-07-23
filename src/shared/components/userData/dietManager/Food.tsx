import { useDiet } from "../../../context/DietManageContext";

import { FoodContextProvider } from "../../../context/FoodContext";
import { MealContextProvider } from "../../../context/MealContext";
import LibraryNavigation from "./LibraryNavigation";
import FoodList from "./FoodList";
import FoodForm from "../../form/FoodForm";

export default function FoodLibrary({ onCancel }: { onCancel: () => void }) {
  const { state } = useDiet();
  return (
    <div className="flex justify-between h-full">
      <LibraryNavigation />
      <MealContextProvider>
        <FoodContextProvider>
          {state === "pool" ? <FoodList onCancel={onCancel} /> : <FoodForm />}
        </FoodContextProvider>
      </MealContextProvider>
    </div>
  );
}
