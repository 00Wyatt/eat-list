import type { DocumentData } from "firebase/firestore";
import { useDoc } from "@/hooks/useDoc";

export const fetchWeeklyMeals = async (
  setWeeklyMeals: (mealData: DocumentData) => void,
) => {
  const weeklyMeals = useDoc("weeklyMeals", "current");
  const weeklyMealsDoc = await weeklyMeals;
  if (weeklyMealsDoc) {
    setWeeklyMeals(weeklyMealsDoc);
  }
};
