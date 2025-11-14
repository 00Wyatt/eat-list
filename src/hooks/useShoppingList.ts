import { useState, useCallback } from "react";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useDoc } from "./useDoc";
import type { Ingredient, Meal, ShoppingListItem, WeeklyMeals } from "@/types";

export function useShoppingList() {
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[] | null>(
    null,
  );

  const fetchShoppingList = useCallback(async () => {
    const data = await useDoc("shoppingList", "current");
    const items = data && Array.isArray(data.items) ? data.items : null;
    setShoppingList(items ?? null);
    return items ?? null;
  }, []);

  const createShoppingList = useCallback(
    async (weeklyMealList: WeeklyMeals | null, mealsList: Meal[] | null) => {
      if (!weeklyMealList || !mealsList) return [];
      const mealIds = Object.values(weeklyMealList).filter(Boolean);

      const allIngredients: Ingredient[] = mealIds.flatMap((mealId: string) => {
        const meal = mealsList.find((m) => m.id === mealId);
        return meal && meal.ingredients ? meal.ingredients : [];
      });

      const grouped: { [name: string]: Ingredient } = {};

      allIngredients.forEach((ingredient) => {
        if (grouped[ingredient.name]) {
          grouped[ingredient.name].quantity += ingredient.quantity;
        } else {
          grouped[ingredient.name] = { ...ingredient };
        }
      });

      const shoppingList = Object.values(grouped).map((ingredient) => ({
        ...ingredient,
        quantity: Math.round(ingredient.quantity * 100) / 100,
        quantityRounded: Math.max(1, Math.round(ingredient.quantity)),
        checked: false,
      }));

      await setDoc(doc(db, "shoppingList", "current"), {
        items: shoppingList,
      });
      setShoppingList(shoppingList);
      return shoppingList;
    },
    [],
  );

  const clearShoppingList = useCallback(async () => {
    try {
      await deleteDoc(doc(db, "shoppingList", "current"));
      setShoppingList(null);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const removeShoppingListItem = useCallback(
    async (name: string) => {
      if (!shoppingList) return;
      const updatedList = shoppingList.filter((item) => item.name !== name);
      await setDoc(doc(db, "shoppingList", "current"), { items: updatedList });
      setShoppingList(updatedList);
    },
    [shoppingList],
  );

  const toggleChecked = useCallback(
    async (name: string) => {
      if (!shoppingList) return;
      const updatedList = shoppingList.map((item) =>
        item.name === name ? { ...item, checked: !item.checked } : item,
      );
      await setDoc(doc(db, "shoppingList", "current"), { items: updatedList });
      setShoppingList(updatedList);
    },
    [shoppingList],
  );

  return {
    shoppingList,
    fetchShoppingList,
    createShoppingList,
    clearShoppingList,
    removeShoppingListItem,
    toggleChecked,
  };
}
