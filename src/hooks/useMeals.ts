import { useState, useCallback } from "react";
import type { Meal } from "@/types";
import { useCollection } from "./useCollection";

export function useMeals() {
  const [meals, setMeals] = useState<Meal[] | null>(null);

  const fetchMeals = useCallback(async () => {
    const mealDocs = await useCollection("meals");
    if (mealDocs) {
      const mealsData = mealDocs.map((doc: any) => {
        const data = doc.data();
        return { id: doc.id, name: data.name, ingredients: data.ingredients };
      });
      mealsData.sort((a: Meal, b: Meal) => a.name.localeCompare(b.name));
      setMeals(mealsData);
      return mealsData;
    }
    setMeals(null);
    return null;
  }, []);

  return {
    meals,
    fetchMeals,
  };
}
