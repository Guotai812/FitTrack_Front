import { CategoryContextProvider } from "../../../context/CategoryContext";
import { useDiet } from "../../../context/DietManageContext";
import { Modal } from "../../ui/Modal";
import DietPanel from "./DietPanel";
import FoodLibrary from "./Food";

type DietFormProps = {
  onCancel: () => void;
};

export default function DietForm({ onCancel }: DietFormProps) {
  const diet = useDiet();
  let content;
  switch (diet.state) {
    case "manage":
      content = <DietPanel onCancel={onCancel} />;
      break;
    case "edit":
      break;
    case "delete":
      break;
    case "pool":
      content = (
        <CategoryContextProvider>
          <FoodLibrary />
        </CategoryContextProvider>
      );
      break;
    case "add":
      break;
  }

  return (
    <Modal
      onCancel={onCancel}
      pad={diet.state === "pool" ? 0 : undefined}
      size={
        diet.state === "pool" || diet.state === "manage"
          ? "w-[60%] h-[50%]"
          : undefined
      }
    >
      {content}
    </Modal>
  );
}
