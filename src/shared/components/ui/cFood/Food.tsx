import { useDiet } from "../../../context/diet/DietManageContext";
import type { Dispatch, SetStateAction } from "react";
import LibraryNavigation from "./LibraryNavigation";
import FoodList from "./FoodList";
import { FoodContextProvider } from "../../../context/diet/FoodContext";
import UpLoadFoodForm from "../../form/UploadFoodForm";

export default function FoodLibrary({
  onCancel,
  setState,
}: {
  onCancel: () => void;
  setState: Dispatch<SetStateAction<"ex" | "food" | undefined>>;
}) {
  const { state } = useDiet();
  console.log("FoodLibrary state:", state);
  return (
    <FoodContextProvider>
      <div className="flex justify-between h-full">
        <LibraryNavigation />
        {state === "upload" ? (
          <UpLoadFoodForm onCancel={onCancel} setState={setState} />
        ) : (
          <FoodList onCancel={onCancel} setNavState={setState} />
        )}
      </div>
    </FoodContextProvider>
  );
}
