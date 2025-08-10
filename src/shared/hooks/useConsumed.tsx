import { type Epool } from "../context/PoolConetext";
import type { Exercises, Info } from "../context/UserContext/UserContextType";

// ——— Display object shapes
type AerobicDisplay = {
  eid: string;
  rid: string;
  name: string;
  image: string;
  duration: number; // in minutes
  consumedKcal: number;
};

type AnaerobicDisplay = {
  eid: string;
  rid: string;
  name: string;
  image: string;
  volume: number; // total weight × reps × sets
  consumedKcal: number;
};

export default function useConsumed(
  exercises: Exercises,
  weight: number,
  ePool: Epool,
  isLoading: boolean = false
) {
  // 1) Loading guard
  if (isLoading || !exercises) {
    return {
      isLoading: true,
      aerobicItems: [],
      anaerobicItems: [],
      aerobicTotal: 0,
      anaerobicTotal: 0,
    };
  }

  // 2) Raw entries
  const aerobics = exercises.aerobic ?? [];
  const anaerobics = exercises.anaerobic ?? [];

  // 3) No-data prompt
  if (isLoading || !exercises) {
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
      const kcalPerMin = (ex.met * 3.5 * weight) / 200;
      const consumedKcal = Math.round(entry.duration * kcalPerMin * 10) / 10;
      return {
        rid: entry.rid,
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
        // done: add rId
        rid: entry.rid,
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

  const volumeRaw = anaerobicItems.reduce((sum, it) => sum + it.volume, 0);
  const durationRaw = aerobicItems.reduce((sum, it) => sum + it.duration, 0);
  const volume = Math.round(volumeRaw * 10) / 10;
  const hours = Math.floor(durationRaw / 60);
  const minutes = durationRaw % 60;

  let duration;
  if (hours > 0) {
    duration = `${hours}h${String(minutes).padStart(2, "0")}m`;
  } else {
    duration = `${minutes}m`;
  }

  return {
    anaerobicItems,
    aerobicItems,
    anaerobicTotal,
    aerobicTotal,
    volume,
    duration,
  };
}
