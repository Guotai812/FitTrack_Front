import React from "react";

// —— Types ——
interface FoodItem {
  food: string;
  weight: number; // in grams
}

interface Meal {
  diet: FoodItem[];
  extra: FoodItem[];
}

type MealKey = "breakfast" | "lunch" | "dinner";
type Meals = Record<MealKey, Meal>;

interface Nutrition {
  kcal: number;
  carbon: number;
  protein: number;
  fat: number;
}

// —— nutrition lookup per 100g ——
const POOL: Record<string, Nutrition> = {
  rice: { kcal: 300, carbon: 70, protein: 6, fat: 3 },
  meat: { kcal: 250, carbon: 5, protein: 20, fat: 3 },
  // …other foods
};

// —— Dummy data ——
const DUMMY: Meals = {
  breakfast: {
    extra: [{ food: "rice", weight: 200 }],
    diet: [{ food: "rice", weight: 100 }],
  },
  lunch: { extra: [], diet: [{ food: "meat", weight: 150 }] },
  dinner: { extra: [], diet: [] },
};

const MEAL_KEYS: MealKey[] = ["breakfast", "lunch", "dinner"];

export const MealList: React.FC = () => {
  // rotate so first non-empty is at front
  const firstIndex = MEAL_KEYS.findIndex(
    (k) => DUMMY[k].diet.length + DUMMY[k].extra.length > 0
  );
  const ordered =
    firstIndex === -1
      ? MEAL_KEYS
      : [...MEAL_KEYS.slice(firstIndex), ...MEAL_KEYS.slice(0, firstIndex)];
  const nonEmpty = ordered.filter(
    (k) => DUMMY[k].diet.length + DUMMY[k].extra.length > 0
  );

  if (nonEmpty.length === 0) {
    return (
      <p className="italic text-center text-gray-500">
        Please click Manage to add your diet
      </p>
    );
  }

  // calc any macro per item
  const calc = (item: FoodItem, key: keyof Nutrition) =>
    Math.round((item.weight * (POOL[item.food]?.[key] ?? 0)) / 100);

  return (
    <div className="space-y-8">
      {nonEmpty.map((mealKey) => {
        const { diet, extra } = DUMMY[mealKey];
        const all = [...diet, ...extra];

        // meal totals
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
            {/* Meal header with totals */}
            <h2 className="text-2xl font-semibold mb-4">
              {label} — {mealTotals.kcal} kcal&nbsp;
              <span className="text-sm text-gray-600">
                (C {mealTotals.carbon}g • P {mealTotals.protein}g • F{" "}
                {mealTotals.fat}g)
              </span>
            </h2>

            {/* Diet items */}
            {diet.map((item, i) => (
              <div
                key={`diet-${i}`}
                className="bg-white shadow rounded-lg p-4 mb-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{item.food}</p>
                  <p className="text-sm text-gray-500">{item.weight} g</p>
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

            {/* Snacks */}
            {extra.length > 0 && (
              <>
                <h3 className="text-lg font-medium mb-2">Snack</h3>
                {extra.map((item, i) => (
                  <div
                    key={`snack-${i}`}
                    className="bg-yellow-50 shadow-sm rounded-lg p-4 mb-3 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{item.food}</p>
                      <p className="text-sm text-gray-500">{item.weight} g</p>
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
