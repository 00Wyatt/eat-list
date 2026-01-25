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
    const items =
      data && Array.isArray(data.items)
        ? data.items.map((item: ShoppingListItem) => ({
            ...item,
            category: item.category ?? null,
          }))
        : null;
    setShoppingList(items ?? null);
    setLoading(false);
    return items ?? null;
  }, []);

  const createShoppingList = useCallback(
    async (
      weeklyMealList: WeeklyMeals | null,
      mealsList: Meal[] | null,
      currentShoppingList: ShoppingListItem[] | null,
      keepCurrentList: boolean,
    ) => {
      if (!weeklyMealList || !mealsList) return [];

      const newItems = buildShoppingListItemsFromWeeklyMeals(
        weeklyMealList,
        mealsList,
      );

      const finalList =
        keepCurrentList && Array.isArray(currentShoppingList)
          ? mergeShoppingLists(newItems, currentShoppingList)
          : newItems;

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

  const changeQuantityRounded = useCallback(
    async (name: string, delta: number) => {
      if (!shoppingList) return;

      const previousList = shoppingList;
      const updatedList = shoppingList.map((item) => {
        if (item.name !== name) return item;
        const nextQuantityRounded = Math.max(1, item.quantityRounded + delta);
        return { ...item, quantityRounded: nextQuantityRounded };
      });

      setShoppingList(updatedList);

      try {
        await setDoc(doc(db, "shoppingList", "current"), {
          items: updatedList,
        });
      } catch (error) {
        setShoppingList(previousList);
        throw error;
      }
    },
    [shoppingList],
  );

  const renameShoppingListItem = useCallback(
    async (currentName: string, nextName: string) => {
      if (!shoppingList) return;

      const nextTrimmed = nextName.trim();
      if (nextTrimmed.length === 0) {
        throw new Error("Item name cannot be empty");
      }

      const currentKey = currentName.trim().toLowerCase();
      const nextKey = nextTrimmed.toLowerCase();

      const duplicateExists = shoppingList.some(
        (item) =>
          item.name.trim().toLowerCase() === nextKey &&
          item.name.trim().toLowerCase() !== currentKey,
      );
      if (duplicateExists) {
        throw new Error("An item with that name already exists");
      }

      const previousList = shoppingList;
      const updatedList = shoppingList.map((item) =>
        item.name === currentName ? { ...item, name: nextTrimmed } : item,
      );

      setShoppingList(updatedList);

      try {
        await setDoc(doc(db, "shoppingList", "current"), {
          items: updatedList,
        });
      } catch (error) {
        setShoppingList(previousList);
        throw error;
      }
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
    changeQuantityRounded,
    renameShoppingListItem,
    loading,
  };
}

/*** Local Helpers ***/

function buildShoppingListItemsFromWeeklyMeals(
  weeklyMealList: WeeklyMeals,
  mealsList: Meal[],
): ShoppingListItem[] {
  const ingredients = getIngredientsFromWeeklyMeals(weeklyMealList, mealsList);
  const grouped = groupIngredientsByName(ingredients);
  return toShoppingListItems(grouped);
}

function getIngredientsFromWeeklyMeals(
  weeklyMealList: WeeklyMeals,
  mealsList: Meal[],
): Ingredient[] {
  const mealObjs = Object.values(weeklyMealList).filter(
    (mealObj) => mealObj.id,
  );

  return mealObjs.flatMap((mealObj) => {
    const meal = mealsList.find((m) => m.id === mealObj.id);
    return meal && meal.ingredients ? meal.ingredients : [];
  });
}

function groupIngredientsByName(
  ingredients: Ingredient[],
): Record<string, Ingredient> {
  const grouped: Record<string, Ingredient> = {};

  ingredients.forEach((ingredient) => {
    if (grouped[ingredient.name]) {
      grouped[ingredient.name].quantity += ingredient.quantity;
    } else {
      grouped[ingredient.name] = { ...ingredient };
    }
  });

  return grouped;
}

function toShoppingListItems(
  grouped: Record<string, Ingredient>,
): ShoppingListItem[] {
  return Object.values(grouped).map((ingredient) => ({
    ...ingredient,
    quantity: Math.round(ingredient.quantity * 100) / 100,
    quantityRounded: Math.max(1, Math.round(ingredient.quantity)),
    checked: false,
    category: ingredient.category ?? null,
  }));
}

function mergeShoppingLists(
  newItems: ShoppingListItem[],
  currentItems: ShoppingListItem[],
): ShoppingListItem[] {
  const combinedList = [...newItems, ...currentItems];
  const grouped: Record<string, ShoppingListItem> = {};

  combinedList.forEach((item) => {
    if (grouped[item.name]) {
      grouped[item.name].quantity += item.quantity;
      grouped[item.name].quantityRounded += item.quantityRounded;

      const existingCategory = grouped[item.name].category ?? null;
      const incomingCategory = item.category ?? null;
      if (existingCategory === null) {
        grouped[item.name].category = incomingCategory;
      } else if (
        incomingCategory !== null &&
        incomingCategory !== existingCategory
      ) {
        grouped[item.name].category = null;
      }
    } else {
      grouped[item.name] = { ...item, category: item.category ?? null };
    }
  });

  return Object.values(grouped);
}
