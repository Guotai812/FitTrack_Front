interface FoodItem {
  food: string;
  weight: number; // in grams
}

interface Meal {
  main: FoodItem[];
  extra: FoodItem[];
}

interface AerobicItem {
  eid: string;
  duration: number;
}

interface SetItem {
  weight: number;
  reps: number;
  sets: number;
}

interface AnaerobicItem {
  eid: string;
  sets: SetItem[];
}

interface Exercises {
  aerobic: AerobicItem[];
  anaerobic: AnaerobicItem[];
}

type MealKey = "breakfast" | "lunch" | "dinner";

type Meals = Record<MealKey, Meal>;

export type Info = {
  kcal: number;
  currentKcal: number;
  weight: number;
  height: number;
  diets: Meals;
  exercises: Exercises;
  date: string;
};
