import { useEffect, useState } from "react";
import { Link } from "react-router";
import { LuPencil, LuPlus } from "react-icons/lu";
import { useMeals } from "@/hooks";
import type { Meal } from "@/types";
import { CreateOrUpdateMealSkeleton } from "./components/CreateOrUpdateMealSkeleton";

export const CreateOrUpdateMeal = () => {
  const { fetchMeals } = useMeals();
  const [meals, setMeals] = useState<Meal[] | null>(null);
  const [selectedMealId, setSelectedMealId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;

    const loadMeals = async () => {
      try {
        const loadedMeals = await fetchMeals();
        if (isCurrent) setMeals(loadedMeals);
      } catch (error) {
        console.error("Failed to load meals:", error);
        if (isCurrent) setMeals(null);
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    void loadMeals();
    return () => {
      isCurrent = false;
    };
  }, [fetchMeals]);

  const selectedMeal = meals?.find((meal) => meal.id === selectedMealId);

  if (loading) {
    return <CreateOrUpdateMealSkeleton />;
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-medium tracking-wider text-gray-800 uppercase">
        Add or Edit a Meal
      </h2>
      <Link
        to="/meals/create"
        className="flex items-center justify-center gap-1 rounded bg-sky-100 px-4 py-2 text-sky-600 duration-200">
        <LuPlus aria-hidden="true" /> Add New Meal
      </Link>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="meal-to-update"
          className="text-sm font-medium text-gray-800">
          Choose a meal to edit
        </label>
        <select
          id="meal-to-update"
          value={selectedMealId}
          onChange={(event) => setSelectedMealId(event.target.value)}
          disabled={!meals?.length}
          className="w-full rounded border border-gray-300 bg-white p-2 disabled:cursor-not-allowed disabled:bg-gray-100">
          <option value="">
            {meals == null
              ? "Unable to load meals"
              : meals.length === 0
                ? "No meals available"
                : "Select a meal"}
          </option>
          {meals?.map((meal) => (
            <option key={meal.id} value={meal.id}>
              {meal.name}
            </option>
          ))}
        </select>
      </div>

      {selectedMeal && (
        <Link
          to={`/meals/${selectedMeal.id}/edit`}
          className="flex items-center justify-center gap-1 rounded bg-gray-100 px-4 py-2 text-gray-800 duration-200">
          <LuPencil aria-hidden="true" /> Edit Meal
        </Link>
      )}
      {meals === null && !loading && (
        <p role="alert" className="text-sm text-red-600">
          Could not load meals. Please try again.
        </p>
      )}
    </section>
  );
};
