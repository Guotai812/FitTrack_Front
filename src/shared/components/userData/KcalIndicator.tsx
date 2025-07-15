import { useUser } from "../../context/UserContext";

import SemiCircleProgress from "../ui/KcalBar";

export default function KcalSection() {
  const user = useUser();
  return (
    <div className=" border border-gray-400 flex flex-col items-center justify-center gap-10">
      <SemiCircleProgress total={user.info.kcal} consumed={0} />
      <div className="w-1/2">
        <p className="text-sm text-gray-400">
          This is the estimated number of calories you can consume daily,
          calculated based on your body metrics and exercise regimen.
        </p>
      </div>
    </div>
  );
}
