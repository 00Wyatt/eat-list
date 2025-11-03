import type { Ingredient, Meal, WeeklyMeal } from "@/types";

export const createShoppingList = (
  weeklyMealList: WeeklyMeal | null,
  mealsList: Meal[] | null,
) => {
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
  }));

  return shoppingList;
};
