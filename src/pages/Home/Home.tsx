import { useEffect, useState } from "react";
import type { DocumentData } from "firebase/firestore";
import { Separator } from "radix-ui";
import { useAuth } from "@/contexts/AuthContext";
import { useCollection } from "@/hooks/useCollection";
import { useDoc } from "@/hooks/useDoc";

export const Home = () => {
  const { user, logout } = useAuth();
  const meals = useCollection("meals");
  const weeklyMeals = useDoc("weeklyMeals", "current");
  const [weeklyMealList, setWeeklyMealList] = useState<DocumentData | null>(
    null,
  );

  const fetchMeals = async () => {
    const mealDocs = await meals;
    if (mealDocs) {
      console.log(
        "Meals:",
        mealDocs.map((doc) => doc.data()),
      );
    }
  };

  useEffect(() => {
    const fetchWeeklyMeals = async () => {
      const weeklyMealsDoc = await weeklyMeals;
      if (weeklyMealsDoc) {
        setWeeklyMealList(weeklyMealsDoc);
      }
    };
    fetchWeeklyMeals();
  }, []);

  return (
    <div className="p-8">
      <div className="flex max-w-64 flex-col items-start gap-4">
        <h1>Welcome, {user?.email}</h1>
        {weeklyMealList ? (
          <>
            <Separator.Root className="my-5 h-[1px] w-100 bg-gray-300" />
            <h2>This Week's Meals:</h2>
            <ul className="list-none">
              {Object.entries(weeklyMealList).map(([day, meal]) => (
                <li key={day}>
                  {day}: {meal}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>No meals selected for this week.</p>
        )}
        <a href="/create-list" className="text-blue-500 underline">
          {weeklyMealList ? "Create New Shopping List" : "Create Shopping List"}
        </a>
        <Separator.Root className="my-5 h-[1px] w-100 bg-gray-300" />
        <div className="flex gap-4">
          <button
            onClick={fetchMeals}
            className="cursor-pointer border border-gray-500 p-2 text-green-700 hover:bg-gray-200">
            Fetch Meals
          </button>
          <button
            onClick={logout}
            className="cursor-pointer border border-gray-500 p-2 text-red-700 hover:bg-gray-200">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
