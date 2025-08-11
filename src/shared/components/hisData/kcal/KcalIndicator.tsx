import { useHisInfo } from "../../../context/useHisInfo";
import SemiCircleProgress from "./KcalBar";

export default function KcalSection() {
  const { info } = useHisInfo();
  return (
    <div className=" border border-gray-400 flex flex-col items-center justify-center gap-10">
      <SemiCircleProgress
        total={info.kcal}
        consumed={info.kcal - info.currentKcal}
      />
      <div className="w-1/2">
        <p className="text-sm text-gray-400">
          This is the estimated number of calories you can consume daily,
          calculated based on your body metrics and exercise regimen.
        </p>
      </div>
    </div>
  );
}
