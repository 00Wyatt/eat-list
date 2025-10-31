import { useEffect, useState } from "react";
import { Link } from "react-router";
import { deleteDoc, doc, type DocumentData } from "firebase/firestore";
import { Separator } from "radix-ui";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "../../../firebase";
import { fetchMeals } from "@/utils/fetchMeals";
import { fetchWeeklyMeals } from "@/utils/fetchWeeklyMeals";

export const Home = () => {
  const { user, logout } = useAuth();
  const [mealsList, setMealsList] = useState<DocumentData[] | null>(null);
  const [weeklyMealList, setWeeklyMealList] = useState<DocumentData | null>(
    null,
  );

  useEffect(() => {
    fetchMeals(setMealsList);
    fetchWeeklyMeals(setWeeklyMealList);
  }, []);

  const getMealNameById = (id: string) => {
    const meal = mealsList?.find((m: DocumentData) => m.id === id);
    return meal ? meal.name : "Unknown meal";
  };

  const handleClearWeeklyMeals = async () => {
    try {
      await deleteDoc(doc(db, "weeklyMeals", "current"));
      setWeeklyMealList(null);
    } catch (error) {
      console.error(error);
    }
  };

  const getShoppingListIngredients = () => {
    if (!weeklyMealList || !mealsList) return [];
    const mealIds = Object.values(weeklyMealList).filter(Boolean);

    const allIngredients = mealIds.flatMap((mealId) => {
      const meal = mealsList.find((m) => m.id === mealId);
      return meal && meal.ingredients ? meal.ingredients : [];
    });
    return allIngredients;
  };

  type Ingredient = {
    name: string;
    quantity: number;
    unit: string;
  };

  const createShoppingList = (ingredients: Ingredient[]) => {
    const grouped: { [name: string]: Ingredient } = {};

    ingredients.forEach((ingredient) => {
      if (grouped[ingredient.name]) {
        grouped[ingredient.name].quantity += ingredient.quantity;
      } else {
        grouped[ingredient.name] = { ...ingredient };
      }
    });

    return Object.values(grouped).map((ingredient) => ({
      ...ingredient,
      quantity: Math.round(ingredient.quantity * 100) / 100,
      quantityRounded: Math.max(1, Math.round(ingredient.quantity)),
    }));
  };

  const allIngredients = getShoppingListIngredients();
  const shoppingListIngredients = createShoppingList(allIngredients);

  return (
    <div className="p-8">
      <div className="flex max-w-80 flex-col items-start gap-4">
        <h1 className="text-xl font-medium">Welcome, {user?.email}</h1>
        {shoppingListIngredients.length > 0 && (
          <>
            <Separator.Root className="my-2 h-[1px] w-100 bg-gray-300" />
            <h2 className="text-lg font-medium">Shopping List</h2>
            <ul>
              {shoppingListIngredients.map((ingredient, index) => (
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
        {weeklyMealList ? (
          <>
            <Separator.Root className="my-2 h-[1px] w-100 bg-gray-300" />
            <h2 className="text-lg font-medium">This Week's Meals:</h2>
            <ul>
              {Object.entries(weeklyMealList).map(
                ([day, mealId]) =>
                  mealId && (
                    <li key={day}>
                      {day}:{" "}
                      <span className="font-medium">
                        {getMealNameById(mealId)}
                      </span>
                    </li>
                  ),
              )}
            </ul>
            <button
              onClick={handleClearWeeklyMeals}
              className="cursor-pointer text-red-700 hover:underline">
              Clear Meals
            </button>
          </>
        ) : (
          <p>No meals selected for this week.</p>
        )}
        <Link to="/create-list" className="text-blue-500 hover:underline">
          {weeklyMealList ? "Select New Meals" : "Select This Week's Meals"}
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
