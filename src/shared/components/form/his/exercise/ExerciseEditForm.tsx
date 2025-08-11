import { useItem } from "../../../../context/exercise/ItemContext";
import { usePool } from "../../../../context/PoolConetext";
import { useHisInfo } from "../../../../context/useHisInfo";

import { Modal } from "../../../ui/Modal";
import AnaerobicEditForm from "./AnaerobicEditForm";
import AerobicEditForm from "./AerobicEditForm";
import { useDelete } from "../../../../context/diet/DeleteContext";
import DeleteConfirm from "../../../ui/DeleteConfirm";

type ExerciseEditFormProps = {
  onCancel: () => void;
};

export default function ExerciseEditForm({ onCancel }: ExerciseEditFormProps) {
  const { isDelete } = useDelete();
  const { item } = useItem();
  const { info } = useHisInfo();
  const { ePool } = usePool();
  if (!info.exercises) return null;
  if (item.type === "aerobic") {
    if (!info.exercises.aerobic) return null;
    const userExercise = info.exercises.aerobic[item.idx];
    const selectedExercise = ePool[userExercise.eid];
    return (
      <Modal onCancel={onCancel} min="300px">
        {isDelete ? (
          <DeleteConfirm
            onCancel={onCancel}
            type="exercise"
            eid={userExercise.eid}
            date={info.date}
          />
        ) : (
          <AerobicEditForm
            onCancel={onCancel}
            userExercise={userExercise}
            selectedExercise={selectedExercise}
          />
        )}
      </Modal>
    );
  }
  if (!info.exercises.anaerobic) return null;
  const userExercise = info.exercises.anaerobic[item.idx];
  const selectedExercise = ePool[userExercise.eid];
  return (
    <Modal onCancel={onCancel} size="w-[30%]">
      {isDelete ? (
        <DeleteConfirm
          onCancel={onCancel}
          type="exercise"
          eid={userExercise.eid}
          date={info.date}
        />
      ) : (
        <AnaerobicEditForm
          onCancel={onCancel}
          userExercise={userExercise}
          selectedExercise={selectedExercise}
        />
      )}
    </Modal>
  );
}
