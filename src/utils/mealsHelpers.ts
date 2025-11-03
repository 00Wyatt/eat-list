import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { useCollection } from "@/hooks/useCollection";
import { useDoc } from "@/hooks/useDoc";
import type { Meal, WeeklyMeal } from "@/types";

export const fetchMeals = async (setMeals: (mealsData: Meal[]) => void) => {
  const meals = useCollection("meals");
  const mealDocs = await meals;
  if (mealDocs) {
    setMeals(
      mealDocs.map((doc) => {
        const data = doc.data();
        return { id: doc.id, name: data.name, ingredients: data.ingredients };
      }),
    );
  }
};

export const fetchWeeklyMeals = async (
  setWeeklyMeals: (mealData: WeeklyMeal | null) => void,
) => {
  const weeklyMeals = useDoc("weeklyMeals", "current");
  const weeklyMealsDoc = await weeklyMeals;
  if (weeklyMealsDoc) {
    setWeeklyMeals(weeklyMealsDoc);
  }
};

export const getMealNameById = (mealsList: Meal[] | null, id: string) => {
  const meal = mealsList?.find((m) => m.id === id);
  return meal ? meal.name : "Unknown meal";
};

export const clearWeeklyMeals = async (
  setWeeklyMealList: (list: { [key: string]: string } | null) => void,
) => {
  try {
    await deleteDoc(doc(db, "weeklyMeals", "current"));
    setWeeklyMealList(null);
  } catch (error) {
    console.error(error);
  }
};
