import { type Exercise } from "../context/PoolConetext";
import type { Info, SetItem } from "../context/UserContext/UserContextType";

export function calculateKcal(
  ex: Exercise,
  info: Info,
  value: number | SetItem[]
) {
  if (!ex) {
    throw new Error(`Exercise "${ex}" not found in pool.`);
  }

  if (ex.type === "aerobic") {
    if (typeof value !== "number") {
      throw new Error("Aerobic exercise expects a numeric duration value.");
    }
    const met = ex.met ?? 0;
    const kcalPerMin = (met * 3.5 * info.weight) / 200;
    return Math.round(value * kcalPerMin * 10) / 10;
  } else {
    if (!Array.isArray(value)) {
      throw new Error("Anaerobic exercise expects an array of SetItem.");
    }

    const kcal = value.reduce((sum, { weight, reps, sets: setCount }) => {
      return (
        sum +
        weight * reps * setCount * (ex.defaultRom ?? 0.5) * ex.kcalPerKgMeter
      );
    }, 0);

    return kcal;
  }
}
