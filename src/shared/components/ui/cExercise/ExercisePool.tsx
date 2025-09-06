import { CategoryContextProvider } from "../../../context/exercise/CategoryContext";
import { useState } from "react";

import { useExercise } from "../../../context/exercise/ExerciseContext";

import { Modal } from "../../ui/Modal";
import SideNavigation from "./SideNavigation";
import ExerciseGallery from "./ExerciseGallery";
import { CustomizedExContextProvider } from "../../../context/CustomizedExContext";
import Button from "../../ui/Button";
import UpLoadExForm from "../../form/UploadExForm";
import EditCEXForm from "../../form/EditCEXForm";

type ExercisePoolProps = {
  onCancel: () => void;
  setState: React.Dispatch<React.SetStateAction<"ex" | "food" | undefined>>; // Optional prop for state management
};

export default function ExercisePool({
  onCancel,
  setState,
}: ExercisePoolProps) {
  const { id } = useExercise();
  const [isUpload, setIsUpload] = useState<boolean>(false);
  function clickCancelHandler() {
    onCancel();
    setState(undefined);
  }
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
          <CustomizedExContextProvider>
            {isUpload ? (
              <UpLoadExForm
                onCancel={onCancel}
                setState={setState}
                setIsUpload={setIsUpload}
              />
            ) : id.trim() === "" ? (
              <div className="w-5/6 h-full p-6 flex flex-col justify-end">
                <ExerciseGallery />
                <div className="flex justify-end gap-4">
                  <Button kind="cancel" onClick={clickCancelHandler}>
                    Cancel
                  </Button>
                  <Button kind="confirm" onClick={() => setIsUpload(true)}>
                    Upload
                  </Button>
                </div>
              </div>
            ) : (
              <EditCEXForm />
            )}
          </CustomizedExContextProvider>
        </div>
      </Modal>
    </CategoryContextProvider>
  );
}
