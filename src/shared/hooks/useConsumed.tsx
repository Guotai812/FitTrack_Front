import { useUser } from "../context/UserContext/UserContext";
import { usePool } from "../context/PoolConetext";

// ——— Display object shapes
type AerobicDisplay = {
  eid: string;
  name: string;
  image: string;
  duration: number; // in minutes
  consumedKcal: number;
};

type AnaerobicDisplay = {
  eid: string;
  name: string;
  image: string;
  volume: number; // total weight × reps × sets
  consumedKcal: number;
};

export default function useConsumed() {
  const { info, isLoading } = useUser();
  const { ePool } = usePool();

  // 1) Loading guard
  if (isLoading || !info.exercises) {
    return {
      isLoading: true,
      aerobicItems: [],
      anaerobicItems: [],
      aerobicTotal: 0,
      anaerobicTotal: 0,
    };
  }

  // 2) Raw entries
  const aerobics = info.exercises.aerobic ?? [];
  const anaerobics = info.exercises.anaerobic ?? [];

  // 3) No-data prompt
  if (isLoading || !info.exercises) {
    return {
      isLoading: true,
      aerobicItems: [],
      anaerobicItems: [],
      aerobicTotal: 0,
      anaerobicTotal: 0,
    };
  }

  // 4) Build display lists
  const aerobicItems: AerobicDisplay[] = aerobics
    .map((entry) => {
      const ex = ePool[entry.eid];
      if (!ex || ex.met == null) return null;
      const kcalPerMin = (ex.met * 3.5 * info.weight) / 200;
      const consumedKcal = Math.round(entry.duration * kcalPerMin * 10) / 10;
      return {
        eid: entry.eid,
        name: ex.name,
        image: ex.image,
        duration: entry.duration,
        consumedKcal,
      };
    })
    .filter((x): x is AerobicDisplay => !!x);

  const anaerobicItems: AnaerobicDisplay[] = anaerobics
    .map((entry) => {
      const ex = ePool[entry.eid];
      if (!ex) return null;
      const defaultRom = ex.defaultRom ?? 0;
      const kcalPerKgMeter = ex.kcalPerKgMeter ?? 0;

      // --- DEBUG LOGGING: inspect each set's contribution ---
      entry.sets.forEach(({ weight, reps, sets: setCount }) => {
        const elementKcal =
          weight * reps * setCount * defaultRom * kcalPerKgMeter;
        console.log("Anaerobic calc:", {
          weight,
          reps,
          setCount,
          defaultRom,
          kcalPerKgMeter,
          elementKcal,
        });
      });

      const volume = entry.sets.reduce(
        (sum, { weight, reps, sets: setCount }) =>
          sum + weight * reps * setCount,
        0
      );

      const rawKcal = entry.sets.reduce(
        (sum, { weight, reps, sets: setCount }) =>
          sum + weight * reps * setCount * defaultRom * kcalPerKgMeter,
        0
      );

      return {
        eid: entry.eid,
        name: ex.name,
        image: ex.image,
        volume,
        consumedKcal: Math.round(rawKcal * 10) / 10,
      };
    })
    .filter((x): x is AnaerobicDisplay => !!x);

  // 5) Section totals
  const aerobicTotalRaw = aerobicItems.reduce(
    (sum, it) => sum + it.consumedKcal,
    0
  );
  const anaerobicTotalRaw = anaerobicItems.reduce(
    (sum, it) => sum + it.consumedKcal,
    0
  );

  const aerobicTotal = Math.round(aerobicTotalRaw * 10) / 10;
  const anaerobicTotal = Math.round(anaerobicTotalRaw * 10) / 10;

  return { anaerobicItems, aerobicItems, anaerobicTotal, aerobicTotal };
}
