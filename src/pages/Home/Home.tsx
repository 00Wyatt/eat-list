import { useEffect, useState } from "react";
import { deleteDoc, doc, type DocumentData } from "firebase/firestore";
import { Separator } from "radix-ui";
import { useAuth } from "@/contexts/AuthContext";
import { useCollection } from "@/hooks/useCollection";
import { useDoc } from "@/hooks/useDoc";
import { db } from "../../../firebase";

export const Home = () => {
  const { user, logout } = useAuth();
  const meals = useCollection("meals");
  const weeklyMeals = useDoc("weeklyMeals", "current");
  const [mealsList, setMealsList] = useState<DocumentData | null>(null);
  const [weeklyMealList, setWeeklyMealList] = useState<DocumentData | null>(
    null,
  );

  const fetchMeals = async () => {
    const mealDocs = await meals;
    if (mealDocs) {
      setMealsList(mealDocs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }
  };

  const fetchWeeklyMeals = async () => {
    const weeklyMealsDoc = await weeklyMeals;
    if (weeklyMealsDoc) {
      setWeeklyMealList(weeklyMealsDoc);
    }
  };

  useEffect(() => {
    fetchMeals();
    fetchWeeklyMeals();
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

  return (
    <div className="p-8">
      <div className="flex max-w-64 flex-col items-start gap-4">
        <h1>Welcome, {user?.email}</h1>
        {weeklyMealList ? (
          <>
            <Separator.Root className="my-5 h-[1px] w-100 bg-gray-300" />
            <h2>This Week's Meals:</h2>
            <ul className="list-none">
              {Object.entries(weeklyMealList).map(
                ([day, mealId]) =>
                  mealId && (
                    <li key={day}>
                      {day}: {getMealNameById(mealId)}
                    </li>
                  ),
              )}
            </ul>
          </>
        ) : (
          <p>No meals selected for this week.</p>
        )}
        <a href="/create-list" className="text-blue-500 hover:underline">
          {weeklyMealList ? "Create New Shopping List" : "Create Shopping List"}
        </a>
        {weeklyMealList && (
          <button
            onClick={handleClearWeeklyMeals}
            className="cursor-pointer text-red-700 hover:underline">
            Clear Weekly Meals
          </button>
        )}
        <Separator.Root className="my-5 h-[1px] w-100 bg-gray-300" />
        <div className="flex gap-4">
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
