import { useIdx } from "../../../context/exercise/IdxContext";
import { useUser } from "../../../context/UserContext/UserContext";
import { usePool } from "../../../context/PoolConetext";

import { Modal } from "../../ui/Modal";
import AnaerobicEditForm from "./AnaerobicEditForm";
import AerobicEditForm from "./AerobicEditForm";

type ExerciseEditFormProps = {
  onCancel: () => void;
};

export default function ExerciseEditForm({ onCancel }: ExerciseEditFormProps) {
  const { idx } = useIdx();
  const { info } = useUser();
  const { ePool } = usePool();
  if (!info.exercises) return null;
  if (idx.type === "aerobic") {
    if (!info.exercises.aerobic) return null;
    const userExercise = info.exercises.aerobic[idx.idx];
    const selectedExercise = ePool[userExercise.eid];
    return (
      <Modal onCancel={onCancel}>
        <AerobicEditForm
          onCancel={onCancel}
          userExercise={userExercise}
          selectedExercise={selectedExercise}
        />
      </Modal>
    );
  }
  if (!info.exercises.anaerobic) return null;
  const userExercise = info.exercises.anaerobic[idx.idx];
  const selectedExercise = ePool[userExercise.eid];
  return (
    <Modal onCancel={onCancel}>
      <AnaerobicEditForm
        onCancel={onCancel}
        userExercise={userExercise}
        selectedExercise={selectedExercise}
      />
    </Modal>
  );
}
