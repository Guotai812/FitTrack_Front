import { useDiet } from "../../../../context/DietManageContext";

import { MealContextProvider } from "../../../../context/MealContext";
import LibraryNavigation from "./LibraryNavigation";
import FoodList from "./FoodList";
import FoodForm from "../../../form/FoodForm";
import { FoodContextProvider } from "../../../../context/FoodContext";

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
