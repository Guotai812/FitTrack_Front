import Button from "../../ui/Button";
import FoodGallery from "./FoodGallery";
import { useDiet } from "../../../context/diet/DietManageContext";
import type { Dispatch, SetStateAction } from "react";

export default function FoodList({
  onCancel,
  setNavState,
}: {
  onCancel: () => void;
  setNavState: Dispatch<SetStateAction<"ex" | "food" | undefined>>;
}) {
  const { setState } = useDiet();
  function cancelHandler() {
    onCancel();
    setNavState(undefined);
  }
  return (
    <div className="w-5/6 h-full p-6 flex flex-col justify-end">
      <FoodGallery />
      <div className="flex justify-end gap-4">
        <Button kind="cancel" onClick={cancelHandler}>
          Cancel
        </Button>
        <Button kind="confirm" onClick={() => setState("upload")}>
          Upload
        </Button>
      </div>
    </div>
  );
}
