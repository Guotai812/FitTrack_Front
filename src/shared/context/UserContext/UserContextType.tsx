interface FoodItem {
  food: string;
  weight: number; // in grams
}

interface Meal {
  main: FoodItem[];
  extra: FoodItem[];
}

export interface AerobicItem {
  eid: string;
  // done: add referenceId
  rid: string;
  duration: number;
}

interface SetItem {
  weight: number;
  reps: number;
  sets: number;
}

export interface AnaerobicItem {
  eid: string;
  // done: add referenceId
  rid: string;
  sets: SetItem[];
}

interface Exercises {
  aerobic: AerobicItem[] | null;
  anaerobic: AnaerobicItem[] | null;
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
