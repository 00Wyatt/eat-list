import { useState, useCallback } from "react";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useDoc } from "./useDoc";
import type { Ingredient, Meal, ShoppingListItem, WeeklyMeals } from "@/types";

export function useShoppingList() {
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[] | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);

  const fetchShoppingList = useCallback(async () => {
    setLoading(true);
    const data = await useDoc("shoppingList", "current");
    const items = data && Array.isArray(data.items) ? data.items : null;
    setShoppingList(items ?? null);
    setLoading(false);
    return items ?? null;
  }, []);

  const createShoppingList = useCallback(
    async (
      weeklyMealList: WeeklyMeals | null,
      mealsList: Meal[] | null,
      shoppingList: ShoppingListItem[] | null,
      keepCurrentList: boolean,
    ) => {
      if (!weeklyMealList || !mealsList) return [];

      const mealObjs = Object.values(weeklyMealList).filter(
        (mealObj) => mealObj.id,
      );

      const allIngredients: Ingredient[] = mealObjs.flatMap((mealObj) => {
        const meal = mealsList.find((m) => m.id === mealObj.id);
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

      const newItems = Object.values(grouped).map((ingredient) => ({
        ...ingredient,
        quantity: Math.round(ingredient.quantity * 100) / 100,
        quantityRounded: Math.max(1, Math.round(ingredient.quantity)),
        checked: false,
      }));

      let finalList: ShoppingListItem[] = newItems;

      if (keepCurrentList && Array.isArray(shoppingList)) {
        const combinedList = [...newItems, ...shoppingList];
        const grouped: { [name: string]: ShoppingListItem } = {};

        combinedList.forEach((item) => {
          if (grouped[item.name]) {
            grouped[item.name].quantity += item.quantity;
            grouped[item.name].quantityRounded += item.quantityRounded;
          } else {
            grouped[item.name] = { ...item };
          }
        });
        finalList = Object.values(grouped);
      }

      await setDoc(doc(db, "shoppingList", "current"), {
        items: finalList,
      });
      setShoppingList(finalList);
      return finalList;
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
    async (name: string, revert: () => void) => {
      if (!shoppingList) return;
      const updatedList = shoppingList.filter((item) => item.name !== name);
      setShoppingList(updatedList);
      try {
        await setDoc(doc(db, "shoppingList", "current"), {
          items: updatedList,
        });
      } catch {
        revert();
      }
    },
    [shoppingList],
  );

  const addShoppingListItem = useCallback(
    async (item: ShoppingListItem, revert: () => void) => {
      const currentList = shoppingList ?? [];
      const updatedList = currentList.concat([item]);
      setShoppingList(updatedList);
      try {
        await setDoc(doc(db, "shoppingList", "current"), {
          items: updatedList,
        });
      } catch {
        revert();
      }
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
    addShoppingListItem,
    toggleChecked,
    loading,
  };
}
