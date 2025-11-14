import type { Meal } from "@/types";

export const getMealNameById = (mealsList: Meal[] | null, id: string) => {
  const meal = mealsList?.find((m) => m.id === id);
  return meal ? meal.name : "Unknown meal";
};
