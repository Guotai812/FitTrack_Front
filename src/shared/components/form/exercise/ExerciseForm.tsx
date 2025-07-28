import { useExercise } from "../../../context/exercise/ExerciseContext";
import { usePool } from "../../../context/PoolConetext";
import AerobicForm from "./AerobicForm";
import AnaerobicForm from "./AnaerobicForm";

export default function ExerciseForm() {
  const { id } = useExercise();
  const { ePool } = usePool();
  const selectedExercise = ePool[id];
  const isAerobic = selectedExercise.type === "aerobic";
  if (isAerobic) return <AerobicForm />;
  return <AnaerobicForm />;
}
