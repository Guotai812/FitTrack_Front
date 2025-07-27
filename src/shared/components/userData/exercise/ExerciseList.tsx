import { useState } from "react";
import { useUser } from "../../../context/UserContext";

// ——— Shared Exercise type
type ExerciseItem = {
  creator: string;
  isPublic: boolean;
  name: string;
  image: string;
  type: "aerobic" | "anaerobic";
  met: number | null;
  kcalPerHour: number | null;
  defaultRom: number | null;
  efficiency: number;
  buffer: number;
  kcalPerKgMeter: number | null;
};

// ——— Dummy pool data
const DUMMY_POOL: Record<string, ExerciseItem> = {
  t2: {
    creator: "user1",
    isPublic: true,
    name: "benchPress",
    image:
      "https://guotai-fittrack.s3.ap-southeast-2.amazonaws.com/exercisePool/benchPress.jpeg",
    type: "anaerobic",
    met: null,
    kcalPerHour: null,
    defaultRom: 0.5,
    efficiency: 0.2,
    buffer: 1.15,
    kcalPerKgMeter: (9.81 / 4184 / 0.2) * 1.15,
  },
  t1: {
    creator: "user1",
    isPublic: true,
    name: "joggling",
    image:
      "https://guotai-fittrack.s3.ap-southeast-2.amazonaws.com/exercisePool/jogging.png",
    type: "aerobic",
    met: 7,
    kcalPerHour: 7 * 70,
    defaultRom: null,
    efficiency: 0.2,
    buffer: 1.15,
    kcalPerKgMeter: null,
  },
};

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
  volume: number; // weight×reps sum
  consumedKcal: number;
};

type SectionKey = "aerobic" | "anaerobic";

// ——— Helper to format minutes as "XhYm"
function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours > 0 ? hours + "h" : ""}${minutes}m`;
}

export default function ExerciseList() {
  const { info, isLoading } = useUser();

  // 1) Loading guard
  if (isLoading || !info.exercises) {
    return (
      <div className="h-full flex flex-col justify-center items-center">
        <p className="italic text-gray-500">Loading…</p>
      </div>
    );
  }

  // 2) Raw entries
  const aerobics = info.exercises.aerobic ?? [];
  const anaerobics = info.exercises.anaerobic ?? [];

  // 3) No-data prompt
  if (aerobics.length + anaerobics.length === 0) {
    return (
      <div className="h-full flex flex-col justify-center items-center">
        <p className="italic text-center text-gray-500">
          Please click Add to record your exercise
        </p>
      </div>
    );
  }

  // 4) Build display lists
  const aerobicItems: AerobicDisplay[] = aerobics
    .map((entry) => {
      const ex = DUMMY_POOL[entry.eid];
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
      const ex = DUMMY_POOL[entry.eid];
      if (!ex) return null;
      const defaultRom = ex.defaultRom ?? 0;
      const kcalPerKgMeter = ex.kcalPerKgMeter ?? 0;
      const volume = entry.sets.reduce(
        (sum, { weight, reps }) => sum + weight * reps,
        0
      );
      const rawKcal = entry.sets.reduce(
        (sum, { weight, reps }) =>
          sum + weight * reps * defaultRom * kcalPerKgMeter,
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
  const aerobicTotal = aerobicItems.reduce(
    (sum, it) => sum + it.consumedKcal,
    0
  );
  const anaerobicTotal = anaerobicItems.reduce(
    (sum, it) => sum + it.consumedKcal,
    0
  );

  // 6) Collapse state
  const [open, setOpen] = useState<Record<SectionKey, boolean>>({
    aerobic: true,
    anaerobic: true,
  });

  // 7) Render
  return (
    <div className="space-y-8">
      {/* Aerobic Section */}
      {aerobicItems.length > 0 && (
        <section>
          <h2
            className="text-2xl font-semibold mb-2 cursor-pointer select-none"
            onClick={() => setOpen((o) => ({ ...o, aerobic: !o.aerobic }))}
          >
            Aerobic — {aerobicTotal.toFixed(1)} Kcal
          </h2>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              open.aerobic ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {aerobicItems.map((it) => (
              <div
                key={it.eid}
                className="bg-white shadow rounded-lg p-4 mb-3 flex justify-between items-center cursor-pointer transition duration-150 ease-in-out hover:bg-gray-100 hover:shadow-lg"
              >
                <div className="flex items-center">
                  <img
                    src={it.image}
                    alt={it.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <p className="font-medium">{it.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">
                    Duration: {formatDuration(it.duration)}
                  </p>
                  <p className="text-xs text-gray-600">
                    Kcal: {it.consumedKcal.toFixed(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Anaerobic Section */}
      {anaerobicItems.length > 0 && (
        <section>
          <h2
            className="text-2xl font-semibold mb-2 cursor-pointer select-none"
            onClick={() => setOpen((o) => ({ ...o, anaerobic: !o.anaerobic }))}
          >
            Anaerobic — {anaerobicTotal.toFixed(1)} Kcal
          </h2>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              open.anaerobic
                ? "max-h-[1000px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            {anaerobicItems.map((it) => (
              <div
                key={it.eid}
                className="bg-white shadow rounded-lg p-4 mb-3 flex justify-between items-center cursor-pointer transition duration-150 ease-in-out hover:bg-gray-100 hover:shadow-lg"
              >
                <div className="flex items-center">
                  <img
                    src={it.image}
                    alt={it.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <p className="font-medium">{it.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">Volume: {it.volume} kg</p>
                  <p className="text-xs text-gray-600">
                    Kcal: {it.consumedKcal.toFixed(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
