import { CategoryContextProvider } from "../../../context/diet/CategoryContext";
import EditCusFoodForm from "../../form/EditCusFoodForm";
import { useDiet } from "../../../context/diet/DietManageContext";
import { Modal } from "../../ui/Modal";
import FoodLibrary from "./Food";
import type { Dispatch, SetStateAction } from "react";

type DietFormProps = {
  onCancel: () => void;
  setState: Dispatch<SetStateAction<"ex" | "food" | undefined>>;
};

export default function DietModal({ onCancel, setState }: DietFormProps) {
  const diet = useDiet();
  let content;
  switch (diet.state) {
    case "pool":
    case "add":
    case "upload":
    case "edit":
      content = (
        <CategoryContextProvider>
          <FoodLibrary onCancel={onCancel} setState={setState} />
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
      setState={setState}
    >
      {content}
    </Modal>
  );
}
