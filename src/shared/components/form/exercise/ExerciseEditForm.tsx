import { useItem } from "../../../context/exercise/ItemContext";
import { useUser } from "../../../context/UserContext/UserContext";
import { usePool } from "../../../context/PoolConetext";

import { Modal } from "../../ui/Modal";
import AnaerobicEditForm from "./AnaerobicEditForm";
import AerobicEditForm from "./AerobicEditForm";

type ExerciseEditFormProps = {
  onCancel: () => void;
};

export default function ExerciseEditForm({ onCancel }: ExerciseEditFormProps) {
  // TODO: change useIdx to useRId;
  const { item } = useItem();
  const { info } = useUser();
  const { ePool } = usePool();
  if (!info.exercises) return null;
  if (item.type === "aerobic") {
    if (!info.exercises.aerobic) return null;
    const userExercise = info.exercises.aerobic[item.idx];
    const selectedExercise = ePool[userExercise.eid];
    return (
      <Modal onCancel={onCancel} min="300px">
        <AerobicEditForm
          onCancel={onCancel}
          userExercise={userExercise}
          selectedExercise={selectedExercise}
        />
      </Modal>
    );
  }
  if (!info.exercises.anaerobic) return null;
  const userExercise = info.exercises.anaerobic[item.idx];
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
