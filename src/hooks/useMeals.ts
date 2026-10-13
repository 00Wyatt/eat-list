import { useState, useCallback } from "react";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import type { Ingredient, Meal } from "@/types";
import { db } from "../../firebase";
import { getCollection } from "./helpers/getCollection";

type MealInput = Pick<Meal, "name" | "ingredients">;

const toMealData = ({ name, ingredients }: MealInput) => ({
  name: name.trim(),
  ingredients: ingredients.map((ingredient) => ({
    ...ingredient,
    name: ingredient.name.trim(),
    unit: ingredient.unit.trim(),
    category: ingredient.category || null,
  })),
});

export function useMeals() {
  const [meals, setMeals] = useState<Meal[] | null>(null);

  const fetchMeals = useCallback(async () => {
    const mealDocs = await getCollection("meals");
    if (mealDocs) {
      const mealsData = mealDocs.map((mealDoc): Meal => {
        const data = mealDoc.data();
        return {
          id: mealDoc.id,
          name: data.name as string,
          ingredients: data.ingredients as Ingredient[],
        };
      });
      mealsData.sort((a: Meal, b: Meal) => a.name.localeCompare(b.name));
      setMeals(mealsData);
      return mealsData;
    }
    setMeals(null);
    return null;
  }, []);

  const createMeal = useCallback(async (meal: MealInput) => {
    const mealData = toMealData(meal);
    const mealRef = await addDoc(collection(db, "meals"), mealData);
    const createdMeal = { id: mealRef.id, ...mealData };

    setMeals((currentMeals) =>
      currentMeals
        ? [...currentMeals, createdMeal].sort((a, b) =>
            a.name.localeCompare(b.name),
          )
        : currentMeals,
    );

    return createdMeal;
  }, []);

  const updateMeal = useCallback(async (mealId: string, meal: MealInput) => {
    const mealData = toMealData(meal);
    await updateDoc(doc(db, "meals", mealId), mealData);

    setMeals(
      (currentMeals) =>
        currentMeals
          ?.map((currentMeal) =>
            currentMeal.id === mealId
              ? { id: mealId, ...mealData }
              : currentMeal,
          )
          .sort((a, b) => a.name.localeCompare(b.name)) ?? null,
    );
  }, []);

  return {
    meals,
    fetchMeals,
    createMeal,
    updateMeal,
  };
}
