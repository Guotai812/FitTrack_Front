import ExerciseContextProvider from "../../../context/exercise/ExerciseContext";

import { useModal } from "../../../hooks/useModal";
import useConsumed from "../../../hooks/useConsumed";

import Button from "../../ui/Button";
import ExercisePool from "./ExercisePool";

export default function ExerciseTopBar() {
  const { aerobicTotal, anaerobicTotal } = useConsumed();
  const { show, modalCancelHandler, modalDisplayHandler } = useModal();

  const totalKcal = aerobicTotal + anaerobicTotal;

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
