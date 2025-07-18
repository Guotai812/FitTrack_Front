import { useDiet } from "../../../context/DietManageContext";
import Button from "../../ui/Button";
import { MealList } from "../../userData/MealList";

type DietPanelProps = {
  onCancel: () => void;
};

export default function DietPanel({ onCancel }: DietPanelProps) {
  const diet = useDiet();
  return (
    <>
      <MealList />
      <div className="flex justify-end gap-4 mt-2">
        <Button kind="cancel" onClick={onCancel}>
          Cancel
        </Button>
        <Button kind="confirm" onClick={() => diet.setState("pool")}>
          Add
        </Button>
      </div>
    </>
  );
}
