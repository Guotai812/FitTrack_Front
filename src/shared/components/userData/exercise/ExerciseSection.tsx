import React from "react";
import { useUser } from "../../../context/UserContext";
import Button from "../../ui/Button";
import ExerciseList from "./ExerciseList";

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

export default function ExerciseSection() {
  const { info, isLoading } = useUser();

  // 1) Show loading state until exercises are available
  if (isLoading || !info.exercises) {
    return <p className="p-4 text-center text-gray-500">Loading…</p>;
  }

  // 2) Default to empty arrays if undefined
  const aerobics = info.exercises.aerobic ?? [];
  const anaerobics = info.exercises.anaerobic ?? [];

  // 3) Calculate aerobic kcal
  const aerobicKcal = aerobics.reduce((total, item) => {
    const ex = DUMMY_POOL[item.eid];
    if (!ex || ex.met == null) return total;
    const kcalPerMin = (ex.met * 3.5 * info.weight) / 200;
    return total + item.duration * kcalPerMin;
  }, 0);

  // 4) Calculate anaerobic kcal using nullish-coalesce
  const anaerobicKcal = anaerobics.reduce((total, item) => {
    const ex = DUMMY_POOL[item.eid];
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
    <div className="bg-white border border-gray-400 p-4">
      <div className="flex flex-col overflow-y-auto h-full">
        <div className="flex justify-between items-center mb-4">
          {totalKcal > 0 && (
            <h2 className="text-lg font-semibold">
              Consumed Kcal: {totalKcal} Kcal
            </h2>
          )}
          <Button kind="confirm">Add</Button>
        </div>
        <ExerciseList />
      </div>
    </div>
  );
}
