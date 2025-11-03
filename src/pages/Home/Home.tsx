import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Separator } from "radix-ui";
import { useAuth } from "@/contexts/AuthContext";
import {
  clearWeeklyMeals,
  fetchMeals,
  fetchWeeklyMeals,
  getMealNameById,
} from "@/utils/mealsHelpers";
import { createShoppingList } from "@/utils/shoppingListHelpers";
import type { Meal, WeeklyMeal } from "@/types";

export const Home = () => {
  const { user, logout } = useAuth();
  const [mealsList, setMealsList] = useState<Meal[] | null>(null);
  const [weeklyMealsList, setWeeklyMealsList] = useState<WeeklyMeal | null>(
    null,
  );

  useEffect(() => {
    fetchMeals(setMealsList);
    fetchWeeklyMeals(setWeeklyMealsList);
  }, []);

  const shoppingList = createShoppingList(weeklyMealsList, mealsList);

  return (
    <div className="p-8">
      <div className="flex max-w-80 flex-col items-start gap-4">
        <h1 className="text-xl font-medium">Welcome, {user?.email}</h1>
        {shoppingList.length > 0 && (
          <>
            <Separator.Root className="my-2 h-[1px] w-100 bg-gray-300" />
            <h2 className="text-lg font-medium">Shopping List</h2>
            <ul>
              {shoppingList.map((ingredient, index) => (
                <li key={index}>
                  <span className="mr-1 font-medium">
                    {ingredient.quantityRounded} x {ingredient.name}
                  </span>{" "}
                  <span className="text-gray-600">
                    ({ingredient.quantity} x {ingredient.unit})
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
        {weeklyMealsList ? (
          <>
            <Separator.Root className="my-2 h-[1px] w-100 bg-gray-300" />
            <h2 className="text-lg font-medium">This Week's Meals:</h2>
            <ul>
              {Object.entries(weeklyMealsList).map(
                ([day, mealId]) =>
                  mealId && (
                    <li key={day}>
                      {day}:{" "}
                      <span className="font-medium">
                        {getMealNameById(mealsList, mealId)}
                      </span>
                    </li>
                  ),
              )}
            </ul>
            <button
              onClick={() => clearWeeklyMeals(setWeeklyMealsList)}
              className="cursor-pointer text-red-700 hover:underline">
              Clear Meals
            </button>
          </>
        ) : (
          <p>No meals selected for this week.</p>
        )}
        <Link to="/create-list" className="text-blue-500 hover:underline">
          {weeklyMealsList ? "Select New Meals" : "Select This Week's Meals"}
        </Link>
        <Separator.Root className="my25 h-[1px] w-100 bg-gray-300" />
        <div className="flex gap-4">
          <button
            onClick={logout}
            className="cursor-pointer border border-gray-500 px-2 py-1.5 text-red-700 hover:bg-gray-200">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
