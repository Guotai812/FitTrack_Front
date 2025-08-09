import type { Meals } from "../context/UserContext/UserContextType";

export default function getTotalsPerFood(diets: Meals): Record<string, number> {
  return Object.values(diets) // Meal[]
    .flatMap(({ main, extra }) => [...main, ...extra]) // FoodItem[]
    .filter(({ food, weight }) => food && weight > 0)
    .reduce<Record<string, number>>((acc, { food, weight }) => {
      acc[food] = (acc[food] || 0) + weight;
      return acc;
    }, {});
}
