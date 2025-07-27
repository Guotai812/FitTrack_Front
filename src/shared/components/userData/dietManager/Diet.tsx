import { useDiet } from "../../../context/diet/DietManageContext";
import { usePool } from "../../../context/PoolConetext";
import { useUser } from "../../../context/UserContext";
import { useModal } from "../../../hooks/useModal";
import DietForm from "./DietModal";
import Button from "../../ui/Button";
import { MealList } from "./MealList";
import { EditContextProvider } from "../../../context/diet/EditContext";
type FoodItem = { food: string; weight: number };
type Meal = { main: FoodItem[]; extra: FoodItem[] };
type Meals = Record<"breakfast" | "lunch" | "dinner", Meal> | {};
function getTotalsPerFood(diets: Meals): Record<string, number> {
  return Object.values(diets) // Meal[]
    .flatMap(({ main, extra }) => [...main, ...extra]) // FoodItem[]
    .filter(({ food, weight }) => food && weight > 0)
    .reduce<Record<string, number>>((acc, { food, weight }) => {
      acc[food] = (acc[food] || 0) + weight;
      return acc;
    }, {});
}

export default function DietSection() {
  const { show, modalCancelHandler, modalDisplayHandler } = useModal();
  const diet = useDiet();
  const { info } = useUser();
  const { pool } = usePool();
  const totalsPerMeal: Record<string, number> = getTotalsPerFood(info.diets);

  let kcal = 0;
  let carbon = 0;
  let protein = 0;
  let fat = 0;
  for (const [mealName, totalWeight] of Object.entries(totalsPerMeal)) {
    kcal =
      Math.round((kcal + (pool[mealName].kcal * totalWeight) / 100) * 10) / 10;
    carbon =
      Math.round((carbon + (pool[mealName].carbon * totalWeight) / 100) * 10) /
      10;
    protein =
      Math.round(
        (protein + (pool[mealName].protein * totalWeight) / 100) * 10
      ) / 10;
    fat =
      Math.round((fat + (pool[mealName].fat * totalWeight) / 100) * 10) / 10;
  }

  function openManageHanlder() {
    modalDisplayHandler();
    diet.setState("pool");
  }

  return (
    <EditContextProvider>
      {" "}
      {show && <DietForm onCancel={modalCancelHandler} />}
      <div className="border p-4 flex flex-col overflow-y-auto h-full">
        <div className="flex justify-between mb-2">
          {kcal !== 0 && (
            <h2 className="text-lg font-semibold">
              Total: {kcal}Kcal
              <span className="text-xs text-gray-500">
                ({`C ${carbon}g • P ${protein}g • F ${fat}g`})
              </span>
            </h2>
          )}
          <Button kind="confirm" onClick={openManageHanlder}>
            Add
          </Button>
        </div>
        <MealList />
      </div>
    </EditContextProvider>
  );
}
