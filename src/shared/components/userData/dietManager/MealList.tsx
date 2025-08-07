import React, { useState } from "react";
import { useUser } from "../../../context/UserContext/UserContext";
import { usePool } from "../../../context/PoolConetext";
import { useModal } from "../../../hooks/useModal";
import { useEdit } from "../../../context/diet/EditContext";
import { DeleteContextProvider } from "../../../context/diet/DeleteContext";

import ModificationModal from "./ModificationModal";
// —— Types ——
interface FoodItem {
  food: string;
  weight: number; // in grams
}

type MealKey = "breakfast" | "lunch" | "dinner";

interface Nutrition {
  creator: string;
  name: string;
  image: string;
  kcal: number;
  carbon: number;
  protein: number;
  fat: number;
}

const MEAL_KEYS: MealKey[] = ["breakfast", "lunch", "dinner"];

export const MealList: React.FC = () => {
  const { setEdit } = useEdit();
  const { show, modalDisplayHandler, modalCancelHandler } = useModal();
  const { pool } = usePool();
  const { info } = useUser();

  // track which meal sections are open
  const [openMeals, setOpenMeals] = useState<Record<MealKey, boolean>>(
    MEAL_KEYS.reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {} as Record<MealKey, boolean>
    )
  );

  // only keep non-empty entries
  const filterReal = (items?: FoodItem[]) =>
    Array.isArray(items)
      ? items.filter(({ food, weight }) => food.trim() !== "" && weight > 0)
      : [];

  const hasReal = (items?: FoodItem[]) => filterReal(items).length > 0;

  // reorder so first non-empty opens first
  const firstIndex = MEAL_KEYS.findIndex(
    (k) => hasReal(info.diets[k]?.main) || hasReal(info.diets[k]?.extra)
  );
  const ordered =
    firstIndex === -1
      ? MEAL_KEYS
      : [...MEAL_KEYS.slice(firstIndex), ...MEAL_KEYS.slice(0, firstIndex)];
  const nonEmpty = ordered.filter(
    (k) => hasReal(info.diets[k]?.main) || hasReal(info.diets[k]?.extra)
  );

  if (nonEmpty.length === 0) {
    return (
      <div className="h-full flex flex-col justify-center items-center">
        <p className="italic text-center text-gray-500">
          Please click Add to add your diet
        </p>
      </div>
    );
  }

  // —— Fix is here ——
  // returns number rounded to 1 decimal
  const calc = (item: FoodItem, key: keyof Nutrition): number => {
    // ensure nutrient value is a number
    const nutrient = Number(pool[item.food]?.[key] ?? 0);
    const raw = (item.weight * nutrient) / 100;
    return Math.round(raw * 10) / 10;
  };

  function mainSelectFoodHandler(foodId: string, meal: MealKey) {
    setEdit({ foodId, meal, isMain: true });
    modalDisplayHandler();
  }

  function extraSelectFoodHandler(foodId: string, meal: MealKey) {
    setEdit({ foodId, meal, isMain: false });
    modalDisplayHandler();
  }

  return (
    <>
      {show && (
        <DeleteContextProvider>
          <ModificationModal onCancel={modalCancelHandler} />
        </DeleteContextProvider>
      )}
      <div className="space-y-8">
        {nonEmpty.map((mealKey) => {
          const { main = [], extra = [] } = info.diets[mealKey] ?? {};
          const realDiet = filterReal(main);
          const realExtra = filterReal(extra);
          const all = [...realDiet, ...realExtra];

          // compute totals for each macro
          const macros = [
            "kcal",
            "carbon",
            "protein",
            "fat",
          ] as (keyof Nutrition)[];
          const mealTotals = macros.reduce(
            (acc, m) => {
              const sum = all.reduce((s, it) => s + calc(it, m), 0);
              return { ...acc, [m]: Math.round(sum * 10) / 10 };
            },
            { kcal: 0, carbon: 0, protein: 0, fat: 0 } as Record<string, number>
          );

          const label = mealKey.charAt(0).toUpperCase() + mealKey.slice(1);
          const isOpen = openMeals[mealKey];

          return (
            <section key={mealKey}>
              {/* header toggles collapse */}
              <h2
                className="text-2xl font-semibold mb-2 cursor-pointer select-none"
                onClick={() =>
                  setOpenMeals((prev) => ({
                    ...prev,
                    [mealKey]: !prev[mealKey],
                  }))
                }
              >
                {label} — {mealTotals.kcal.toFixed(1)} kcal&nbsp;
                <span className="text-sm text-gray-600">
                  (C {mealTotals.carbon.toFixed(1)}g • P{" "}
                  {mealTotals.protein.toFixed(1)}g • F{" "}
                  {mealTotals.fat.toFixed(1)}
                  g)
                </span>
              </h2>

              {/* smooth collapse */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {/* main items */}
                {realDiet.map((item) => (
                  <div
                    onClick={() => mainSelectFoodHandler(item.food, mealKey)}
                    key={item.food}
                    className="bg-white shadow rounded-lg p-4 mb-3 flex justify-between items-center cursor-pointer transition duration-150 ease-in-out hover:bg-gray-100 hover:shadow-lg"
                  >
                    <div className="flex items-center">
                      <img
                        src={pool[item.food].image}
                        alt={pool[item.food].name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <p className="font-medium">{pool[item.food].name}</p>
                        <p className="text-sm text-gray-500">{item.weight} g</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">
                        {calc(item, "kcal").toFixed(1)} kcal
                      </p>
                      <p className="text-xs text-gray-600">
                        C
                        {Math.round(
                          Number(calc(item, "carbon").toFixed(1)) * 10
                        ) / 10}
                        g • P{" "}
                        {Math.round(
                          Number(calc(item, "protein").toFixed(1)) * 10
                        ) / 10}{" "}
                        g • F
                        {Math.round(Number(calc(item, "fat").toFixed(1)) * 10) /
                          10}{" "}
                        g
                      </p>
                    </div>
                  </div>
                ))}

                {/* snack items */}
                {realExtra.length > 0 && (
                  <>
                    <h3 className="text-lg font-medium mb-2">Snack</h3>
                    {realExtra.map((item) => (
                      <div
                        onClick={() =>
                          extraSelectFoodHandler(item.food, mealKey)
                        }
                        key={item.food}
                        className="bg-yellow-50 shadow-sm rounded-lg p-4 mb-3 flex justify-between items-center cursor-pointer transition duration-150 ease-in-out hover:bg-yellow-100 hover:shadow-md"
                      >
                        <div className="flex items-center">
                          <img
                            src={pool[item.food].image}
                            alt={pool[item.food].name}
                            className="w-12 h-12 rounded-full object-cover mr-4"
                          />
                          <div>
                            <p className="font-medium">
                              {pool[item.food].name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {item.weight} g
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">
                            {calc(item, "kcal").toFixed(1)} kcal
                          </p>
                          <p className="text-xs text-gray-600">
                            C{calc(item, "carbon").toFixed(1)} g • P
                            {calc(item, "protein").toFixed(1)} g • F
                            {calc(item, "fat").toFixed(1)} g
                          </p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
};
