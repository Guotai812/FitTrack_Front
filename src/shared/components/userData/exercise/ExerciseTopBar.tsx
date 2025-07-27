import { usePool } from "../../../context/PoolConetext";
import { useUser } from "../../../context/UserContext";
import { useModal } from "../../../hooks/useModal";

import Button from "../../ui/Button";
import ExercisePool from "./ExercisePool";

export default function ExerciseTopBar() {
  const { show, modalCancelHandler, modalDisplayHandler } = useModal();
  const { info, isLoading } = useUser();
  const { ePool } = usePool();

  // 1) Show loading state until exercises are available
  if (isLoading || !info.exercises) {
    return <p className="p-4 text-center text-gray-500">Loading…</p>;
  }

  // 2) Default to empty arrays if undefined
  const aerobics = info.exercises.aerobic ?? [];
  const anaerobics = info.exercises.anaerobic ?? [];

  // 3) Calculate aerobic kcal
  const aerobicKcal = aerobics.reduce((total, item) => {
    const ex = ePool[item.eid];
    if (!ex || ex.met == null) return total;
    const kcalPerMin = (ex.met * 3.5 * info.weight) / 200;
    return total + item.duration * kcalPerMin;
  }, 0);

  // 4) Calculate anaerobic kcal using nullish-coalesce
  const anaerobicKcal = anaerobics.reduce((total, item) => {
    const ex = ePool[item.eid];
    if (!ex) return total;

    // ensure numeric values
    const defaultRom = ex.defaultRom ?? 0;
    const kcalPerKgMeter = ex.kcalPerKgMeter ?? 0;

    const exerciseKcal = item.sets.reduce(
      (sum, { weight, reps }) =>
        sum + weight * reps * defaultRom * kcalPerKgMeter,
      0
    );
    return total + exerciseKcal;
  }, 0);

  // 5) Round to one decimal
  const totalKcal = Math.round((aerobicKcal + anaerobicKcal) * 10) / 10;
  return (
    <>
      {show && <ExercisePool onCancel={modalCancelHandler} />}
      <div className="flex justify-between items-center mb-4">
        {totalKcal > 0 && (
          <h2 className="text-lg font-semibold">
            Consumed Kcal: {totalKcal} Kcal
          </h2>
        )}
        <Button kind="confirm" onClick={modalDisplayHandler}>
          Add
        </Button>
      </div>
    </>
  );
}
