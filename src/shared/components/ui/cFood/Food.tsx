import { useDiet } from "../../../context/diet/DietManageContext";
import { type Dispatch, type SetStateAction } from "react";
import LibraryNavigation from "./LibraryNavigation";
import FoodList from "./FoodList";
import { FoodContextProvider } from "../../../context/diet/FoodContext";
import UpLoadFoodForm from "../../form/UploadFoodForm";
import { CustomizedFoodContextProvider } from "../../../context/CustomizedFoodContext";

export default function FoodLibrary({
  onCancel,
  setState,
}: {
  onCancel: () => void;
  setState: Dispatch<SetStateAction<"ex" | "food" | undefined>>;
}) {
  const { state } = useDiet();
  return (
    <CustomizedFoodContextProvider>
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
    </CustomizedFoodContextProvider>
  );
}
