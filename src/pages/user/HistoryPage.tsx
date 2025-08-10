const baseUrl = import.meta.env.VITE_BACKEND_URL;
import { useEffect, useState } from "react";
import { useDate } from "../../shared/context/DateContext";
import useHttp from "../../shared/hooks/useHttp";
import { useAuth } from "../../shared/context/AuthContext";
import type {
  Exercises,
  Meals,
} from "../../shared/context/UserContext/UserContextType";
import getTotalsPerFood from "../../shared/util/getTotalsPerFood";
import { usePool } from "../../shared/context/PoolConetext";
import useConsumed from "../../shared/hooks/useConsumed";
import { useModal } from "../../shared/hooks/useModal";
import HisModal from "../../shared/components/ui/HisModal";

type DataType = {
  date: string;
  exercises: Exercises;
  diets: Meals;
  weight: number;
};

const MONTH_TABLE = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

export default function HistoryPage() {
  const { pool, ePool, isLoading: isPoolLoaing } = usePool();
  const [day, setDay] = useState<string>("");
  const { user, token } = useAuth();
  const { date } = useDate();
  const formattedDate = `${date.year}-${String(date.month).padStart(2, "0")}`;
  const { isLoading, sendRequest } = useHttp<{
    msg: string;
    data: DataType[];
  }>();
  const [data, setData] = useState<DataType[]>();
  const { show, modalCancelHandler, modalDisplayHandler } = useModal();
  useEffect(() => {
    async function getHis() {
      if (!token || !user) return;
      try {
        const responseData = await sendRequest({
          url: `${baseUrl}/basic/${user?.userId}/getHis?date=${formattedDate}`,
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(responseData.data);
      } catch (err) {
        // TODO: add error handleing
      }
    }
    getHis();
  }, [date, token, user]);
  function dayHandler(day: string) {
    modalDisplayHandler();
    setDay(day);
  }

  if (isLoading || isPoolLoaing) {
    return <div>isLoading..</div>;
  }
  return (
    <>
      {show && <HisModal onCancel={modalCancelHandler} day={day} />}
      <div className="p-6 h-full">
        <div className="mb-10">
          <p className="text-9xl mb-4">{date.year}</p>
          <p className="text-8xl">{MONTH_TABLE[date.month - 1]}</p>
        </div>

        <div>
          <ol>
            {data?.map((e, idx) => {
              const totalsPerMeal: Record<string, number> = getTotalsPerFood(
                e.diets || []
              );
              let kcal = 0;
              let carbon = 0;
              let protein = 0;
              let fat = 0;

              for (const [mealName, totalWeight] of Object.entries(
                totalsPerMeal
              )) {
                kcal =
                  Math.round(
                    (kcal + (pool[mealName].kcal * totalWeight) / 100) * 10
                  ) / 10;
                carbon =
                  Math.round(
                    (carbon + (pool[mealName].carbon * totalWeight) / 100) * 10
                  ) / 10;
                protein =
                  Math.round(
                    (protein + (pool[mealName].protein * totalWeight) / 100) *
                      10
                  ) / 10;
                fat =
                  Math.round(
                    (fat + (pool[mealName].fat * totalWeight) / 100) * 10
                  ) / 10;
              }

              const { aerobicTotal, anaerobicTotal, volume, duration } =
                useConsumed(e.exercises, e.weight, ePool);

              return (
                <li key={idx} onClick={() => dayHandler(e.date)}>
                  <div className="mb-6 h-20 flex justify-between shadow-sm rounded-xl hover:bg-gray-300 p-2">
                    <div className="bg-green-300 w-15 aspect-square rounded-full flex items-center justify-center text-center hover:shadow-2xl">
                      <p className="text-3xl">{e.date}</p>
                    </div>

                    <div className="flex flex-col justify-center items-center">
                      <p>Intaked Kcal: {kcal} Kcal</p>
                      <p className="flex justify-center items-center gap-2 text-gray-500">
                        <span>c {carbon}g</span>
                        <span>p {protein}g</span>
                        <span>f {fat}g</span>
                      </p>
                    </div>

                    <div className="flex flex-col justify-center items-center">
                      <p>Consumed Kcal: {aerobicTotal + anaerobicTotal} Kcal</p>
                      <p className="flex flex-col justify-center items-center text-gray-500">
                        <span>Volume: {volume}kg</span>
                        <span>Cartio Duration: {duration}</span>
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </>
  );
}
