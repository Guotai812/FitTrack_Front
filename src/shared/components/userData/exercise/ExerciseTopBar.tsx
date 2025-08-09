import ExerciseContextProvider from "../../../context/exercise/ExerciseContext";
import { useUser } from "../../../context/UserContext/UserContext";
import { usePool } from "../../../context/PoolConetext";
import { useModal } from "../../../hooks/useModal";
import useConsumed from "../../../hooks/useConsumed";

import Button from "../../ui/Button";
import ExercisePool from "./ExercisePool";
// TODO: pass info as parameter to useConsumed
export default function ExerciseTopBar() {
  const { info, isLoading } = useUser();
  const { ePool } = usePool();
  const { aerobicTotal, anaerobicTotal } = useConsumed(isLoading, info, ePool);
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
