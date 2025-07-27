import { Modal } from "../../ui/Modal";
import SideNavigation from "./SideNavigation";
import ExerciseGallery from "./ExerciseGallery";
import { CategoryContextProvider } from "../../../context/exercise/CategoryContext";

type ExercisePoolProps = {
  onCancel: () => void;
};

export default function ExercisePool({ onCancel }: ExercisePoolProps) {
  return (
    <CategoryContextProvider>
      <Modal onCancel={onCancel} pad={0} size="w-[40%] h-[50%]" min="700px">
        <div className="flex justify-between h-full">
          <SideNavigation />
          <ExerciseGallery />
        </div>
      </Modal>
    </CategoryContextProvider>
  );
}
