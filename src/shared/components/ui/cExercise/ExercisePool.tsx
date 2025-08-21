import { CategoryContextProvider } from "../../../context/exercise/CategoryContext";

import { useExercise } from "../../../context/exercise/ExerciseContext";

import { Modal } from "../../ui/Modal";
import SideNavigation from "./SideNavigation";
import ExerciseGallery from "./ExerciseGallery";
import ExerciseForm from "../../form/exercise/ExerciseForm";
import { CustomizedExContextProvider } from "../../../context/CustomizedExContext";

type ExercisePoolProps = {
  onCancel: () => void;
  setState: React.Dispatch<React.SetStateAction<"ex" | "food" | undefined>>; // Optional prop for state management
};

export default function ExercisePool({
  onCancel,
  setState,
}: ExercisePoolProps) {
  const { id } = useExercise();
  return (
    <CategoryContextProvider>
      <Modal
        onCancel={onCancel}
        setState={setState}
        pad={0}
        size="w-[40%] h-[60%]"
        min="700px"
      >
        <div className="flex justify-between h-full">
          <SideNavigation />
          {id.trim() === "" ? (
            <CustomizedExContextProvider>
              <ExerciseGallery onCancel={onCancel} setState={setState} />
            </CustomizedExContextProvider>
          ) : (
            <ExerciseForm />
          )}
        </div>
      </Modal>
    </CategoryContextProvider>
  );
}
