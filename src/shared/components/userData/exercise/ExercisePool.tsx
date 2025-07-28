import { CategoryContextProvider } from "../../../context/exercise/CategoryContext";

import { useExercise } from "../../../context/exercise/ExerciseContext";

import { Modal } from "../../ui/Modal";
import SideNavigation from "./SideNavigation";
import ExerciseGallery from "./ExerciseGallery";
import ExerciseForm from "../../form/exercise/ExerciseForm";

type ExercisePoolProps = {
  onCancel: () => void;
};

export default function ExercisePool({ onCancel }: ExercisePoolProps) {
  const { id } = useExercise();
  return (
    <CategoryContextProvider>
      <Modal onCancel={onCancel} pad={0} size="w-[40%] h-[50%]" min="700px">
        <div className="flex justify-between h-full">
          <SideNavigation />
          {id.trim() === "" ? (
            <ExerciseGallery onCancel={onCancel} />
          ) : (
            <ExerciseForm />
          )}
        </div>
      </Modal>
    </CategoryContextProvider>
  );
}
