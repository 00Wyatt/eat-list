import type { Meal } from "@/types";

export const getMealById = (mealsList: Meal[] | null, id: string) => {
  const meal = mealsList?.find((m) => m.id === id);
  return meal;
};
