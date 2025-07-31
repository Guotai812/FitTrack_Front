import { useState } from "react";
import useConsumed from "../../../hooks/useConsumed";
import { useModal } from "../../../hooks/useModal";
import { useItem } from "../../../context/exercise/ItemContext";
import ExerciseEditForm from "../../form/exercise/ExerciseEditForm";

type SectionKey = "aerobic" | "anaerobic";

// ——— Helper to format minutes as "XhYm"
function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours > 0 ? hours + "h" : ""}${minutes}m`;
}

export default function ExerciseList() {
  const { setItem } = useItem();
  const { show, modalDisplayHandler, modalCancelHandler } = useModal();
  const { anaerobicItems, aerobicItems, anaerobicTotal, aerobicTotal } =
    useConsumed();

  // 6) Collapse state
  const [open, setOpen] = useState<Record<SectionKey, boolean>>({
    aerobic: true,
    anaerobic: true,
  });

  if (anaerobicItems.length + aerobicItems.length === 0) {
    return (
      <div className="h-full flex flex-col justify-center items-center">
        <p className="italic text-center text-gray-500">
          Please click Add to add your diet
        </p>
      </div>
    );
  }

  // done: change recordIdx to recordRId(rId: string, type: "")
  function recordIdx(idx: number, rid: string, type: "aerobic" | "anaerobic") {
    setItem({ rid, type, idx });
    modalDisplayHandler();
  }

  // 7) Render
  return (
    <>
      {show && <ExerciseEditForm onCancel={modalCancelHandler} />}
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
                open.aerobic
                  ? "max-h-[1000px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              {aerobicItems.map((it, idx) => (
                <div
                  // done: change recordIdx to recordRid(rId, "aerobic")
                  onClick={() => recordIdx(idx, it.rid, "aerobic")}
                  key={idx}
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
              onClick={() =>
                setOpen((o) => ({ ...o, anaerobic: !o.anaerobic }))
              }
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
              {anaerobicItems.map((it, idx) => (
                <div
                  // done: change recordIdx to recordRid(rId, "aerobic")
                  onClick={() => recordIdx(idx, it.rid, "anaerobic")}
                  key={idx}
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
    </>
  );
}
