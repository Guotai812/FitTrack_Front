import React from "react";
import { useUser } from "../../context/UserContext";
import { usePool } from "../../context/PoolConetext";

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
  const { pool } = usePool();
  const { info } = useUser();

  // only keep real entries (non-empty food and weight>0)
  const filterReal = (items: FoodItem[]) =>
    items.filter(({ food, weight }) => food.trim() !== "" && weight > 0);

  const hasReal = (items: FoodItem[]) => filterReal(items).length > 0;

  // rotate so first meal with any real items is front
  const firstIndex = MEAL_KEYS.findIndex(
    (k) => hasReal(info.diets[k].diet) || hasReal(info.diets[k].extra)
  );
  const ordered =
    firstIndex === -1
      ? MEAL_KEYS
      : [...MEAL_KEYS.slice(firstIndex), ...MEAL_KEYS.slice(0, firstIndex)];

  // pick only meals that have any real items
  const nonEmpty = ordered.filter(
    (k) => hasReal(info.diets[k].diet) || hasReal(info.diets[k].extra)
  );

  if (nonEmpty.length === 0) {
    return (
      <p className="italic text-center text-gray-500">
        Please click Manage to add your diet
      </p>
    );
  }

  // helper to compute a macro value for one item
  const calc = (item: FoodItem, key: keyof Nutrition) =>
    Math.round((item.weight * Number(pool[item.food]?.[key] ?? 0)) / 100);

  return (
    <div className="space-y-8">
      {nonEmpty.map((mealKey) => {
        const { diet, extra } = info.diets[mealKey];
        const realDiet = filterReal(diet);
        const realExtra = filterReal(extra);
        const all = [...realDiet, ...realExtra];

        // totals across diet + extra
        const mealTotals = (
          ["kcal", "carbon", "protein", "fat"] as (keyof Nutrition)[]
        ).reduce(
          (acc, macro) => ({
            ...acc,
            [macro]: all.reduce((sum, it) => sum + calc(it, macro), 0),
          }),
          { kcal: 0, carbon: 0, protein: 0, fat: 0 } as Record<string, number>
        );

        const label = mealKey.charAt(0).toUpperCase() + mealKey.slice(1);

        return (
          <section key={mealKey}>
            <h2 className="text-2xl font-semibold mb-4">
              {label} — {mealTotals.kcal} kcal&nbsp;
              <span className="text-sm text-gray-600">
                (C {mealTotals.carbon}g • P {mealTotals.protein}g • F{" "}
                {mealTotals.fat}g)
              </span>
            </h2>

            {/* only render diet if there are real diet items */}
            {realDiet.length > 0 &&
              realDiet.map((item, i) => (
                <div
                  key={`diet-${i}`}
                  className="bg-white shadow rounded-lg p-4 mb-3 flex justify-between items-center"
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
                    <p className="text-sm">{calc(item, "kcal")} kcal</p>
                    <p className="text-xs text-gray-600">
                      C{calc(item, "carbon")} g • P{calc(item, "protein")} g • F
                      {calc(item, "fat")} g
                    </p>
                  </div>
                </div>
              ))}

            {/* only render snack if there are real extra items */}
            {realExtra.length > 0 && (
              <>
                <h3 className="text-lg font-medium mb-2">Snack</h3>
                {realExtra.map((item, i) => (
                  <div
                    key={`snack-${i}`}
                    className="bg-yellow-50 shadow-sm rounded-lg p-4 mb-3 flex justify-between items-center"
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
                      <p className="text-sm">{calc(item, "kcal")} kcal</p>
                      <p className="text-xs text-gray-600">
                        C{calc(item, "carbon")} g • P{calc(item, "protein")} g •
                        F{calc(item, "fat")} g
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </section>
        );
      })}
    </div>
  );
};
