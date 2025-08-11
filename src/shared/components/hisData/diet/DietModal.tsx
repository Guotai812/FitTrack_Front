import { CategoryContextProvider } from "../../../context/diet/CategoryContext";
import { useDiet } from "../../../context/diet/DietManageContext";
import { Modal } from "../../ui/Modal";
import FoodLibrary from "./Food";

type DietFormProps = {
  onCancel: () => void;
};

export default function DietModal({ onCancel }: DietFormProps) {
  const diet = useDiet();
  let content;
  switch (diet.state) {
    case "edit":
      break;
    case "delete":
      break;
    case "pool":
    case "add":
      content = (
        <CategoryContextProvider>
          <FoodLibrary onCancel={onCancel} />
        </CategoryContextProvider>
      );
      break;
  }

  return (
    <Modal
      onCancel={onCancel}
      pad={diet.state === "pool" || diet.state === "add" ? 0 : undefined}
      size={
        diet.state === "pool" || diet.state === "manage" || diet.state === "add"
          ? "w-[40%] h-[50%]"
          : undefined
      }
      min="700px"
    >
      {content}
    </Modal>
  );
}
