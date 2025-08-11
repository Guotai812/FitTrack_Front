import ExerciseContextProvider from "../../../context/exercise/ExerciseContext";
import { usePool } from "../../../context/PoolConetext";
import { useModal } from "../../../hooks/useModal";
import useConsumed from "../../../hooks/useConsumed";
import { useHisInfo } from "../../../context/useHisInfo";
import Button from "../../ui/Button";
import ExercisePool from "./ExercisePool";
export default function ExerciseTopBar() {
  const { info, isLoading } = useHisInfo();
  const { ePool } = usePool();
  const { aerobicTotal, anaerobicTotal } = useConsumed(
    info.exercises,
    info.weight,
    ePool,
    isLoading
  );
  const { show, modalCancelHandler, modalDisplayHandler } = useModal();

  const totalKcal = Math.round((aerobicTotal + anaerobicTotal) * 10) / 10;

  return (
    <>
      {show && (
        <ExerciseContextProvider>
          <ExercisePool onCancel={modalCancelHandler} />
        </ExerciseContextProvider>
      )}
      <div className="flex justify-between items-center mb-4">
        {totalKcal > 0 && (
          <h2 className="text-lg font-semibold">
            Consumed Kcal: {Math.round(totalKcal * 10) / 10} Kcal
          </h2>
        )}
        <Button kind="confirm" onClick={modalDisplayHandler}>
          Add
        </Button>
      </div>
    </>
  );
}
