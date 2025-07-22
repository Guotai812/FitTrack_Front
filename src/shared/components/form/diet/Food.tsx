import LibraryNavigation from "../../userData/LibraryNavigation";
import FoodList from "../../userData/FoodList";
import { useDiet } from "../../../context/DietManageContext";
import FoodForm from "./FoodForm";
import { FoodContextProvider } from "../../../context/FoodContext";
import { MealContextProvider } from "../../../context/MealContext";

export default function FoodLibrary() {
  const { state } = useDiet();
  return (
    <div className="flex justify-between h-full">
      <LibraryNavigation />
      <MealContextProvider>
        <FoodContextProvider>
          {state === "pool" ? <FoodList /> : <FoodForm />}
        </FoodContextProvider>
      </MealContextProvider>
    </div>
  );
}
