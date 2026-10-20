import { useEffect, useState } from "react";
import { LuPencil, LuPlus } from "react-icons/lu";
import { useMeals } from "@/hooks";
import type { Meal } from "@/types";
import { CreateOrUpdateMealSkeleton } from "./components/CreateOrUpdateMealSkeleton";
import { LinkButton } from "../common/Buttons/LinkButton/LinkButton";
import { Combobox } from "../common/Combobox";

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
      <LinkButton to="/meals/create">
        <LuPlus aria-hidden="true" /> Add New Meal
      </LinkButton>

      <div className="flex flex-col gap-2">
        <Combobox
          id="meal-to-update"
          label="Choose a meal to edit"
          placeholder={
            meals == null
              ? "Unable to load meals"
              : meals.length === 0
                ? "No meals available"
                : "Search meals"
          }
          options={(meals ?? []).map((meal) => ({
            value: meal.id,
            label: meal.name,
          }))}
          value={selectedMealId}
          onValueChange={setSelectedMealId}
          disabled={!meals?.length}
        />
      </div>

      {selectedMeal && (
        <LinkButton color="neutral" to={`/meals/${selectedMeal.id}/edit`}>
          <LuPencil aria-hidden="true" /> Edit Meal
        </LinkButton>
      )}
      {meals === null && !loading && (
        <p role="alert" className="text-sm text-red-600">
          Could not load meals. Please try again.
        </p>
      )}
    </section>
  );
};
