import LibraryNavigation from "../../userData/LibraryNavigation";
import FoodList from "../../userData/FoodList";
import { useDiet } from "../../../context/DietManageContext";
import FoodForm from "./FoodForm";
import { FoodContextProvider } from "../../../context/FoodContext";

export default function FoodLibrary() {
  const { state } = useDiet();
  return (
    <div className="flex justify-between h-full">
      <LibraryNavigation />
      <FoodContextProvider>
        {state === "pool" ? <FoodList /> : <FoodForm />}
      </FoodContextProvider>
    </div>
  );
}
