import { useEffect } from "react";
import { Link } from "react-router";
import { Separator } from "radix-ui";
import { useAuth } from "@/contexts/AuthContext";
import { getMealNameById } from "@/utils/helpers";
import { ShoppingList } from "@/components/ShoppingList";
import { useShoppingList } from "@/hooks";
import { useWeeklyMeals } from "@/hooks";
import { useMeals } from "@/hooks";

export const Home = () => {
  const { user, logout } = useAuth();

  const { meals, fetchMeals } = useMeals();
  const {
    shoppingList,
    fetchShoppingList,
    clearShoppingList,
    removeShoppingListItem,
    toggleChecked,
  } = useShoppingList();
  const { weeklyMeals, fetchWeeklyMeals, clearWeeklyMeals } = useWeeklyMeals();

  useEffect(() => {
    fetchMeals();
    fetchWeeklyMeals();
    fetchShoppingList();
  }, []);

  return (
    <div className="p-8">
      <div className="flex max-w-80 flex-col items-start gap-4">
        <h1 className="text-xl font-medium">Welcome, {user?.email}</h1>
        {shoppingList && shoppingList.length > 0 && (
          <>
            <Separator.Root className="my-2 h-[1px] w-100 bg-gray-300" />
            <ShoppingList
              shoppingList={shoppingList}
              onRemove={removeShoppingListItem}
              onToggleChecked={toggleChecked}
            />
          </>
        )}
        {weeklyMeals ? (
          <>
            <Separator.Root className="my-2 h-[1px] w-100 bg-gray-300" />
            <h2 className="text-lg font-medium">This Week's Meals:</h2>
            <ul>
              {Object.entries(weeklyMeals).map(
                ([day, mealId]) =>
                  mealId && (
                    <li key={day}>
                      {day}:{" "}
                      <span className="font-medium">
                        {getMealNameById(meals, mealId)}
                      </span>
                    </li>
                  ),
              )}
            </ul>
            <button
              onClick={() => {
                clearWeeklyMeals();
                clearShoppingList();
              }}
              className="cursor-pointer text-red-700 hover:underline">
              Clear Meals
            </button>
          </>
        ) : (
          <p>No meals selected for this week.</p>
        )}
        <Link to="/select-meals" className="text-blue-500 hover:underline">
          {weeklyMeals ? "Select New Meals" : "Select This Week's Meals"}
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
