import { useDiet } from "../../../context/DietManageContext";
import { Modal } from "../../ui/Modal";
import DietPanel from "./DietPanel";

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
      break;
    case "add":
      break;
  }

  return <Modal onCancel={onCancel}>{content}</Modal>;
}
