import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Separator } from "radix-ui";
import { LuCalendarPlus, LuPencil, LuTrash2 } from "react-icons/lu";
import { Modal } from "../Modal";
import { ConfirmationDialog } from "../common/ConfirmationDialog";
import { Button } from "../common/Buttons/Button";
import { sortDays, WEEK_DAYS } from "@/utils/helpers";
import { useMeals, useWeeklyMeals } from "@/hooks";
import { WeeklyMealsSectionSkeleton } from "./components/WeeklyMealsSectionSkeleton";
import type { WeeklyMeals } from "@/types";
import { Combobox } from "../common/Combobox";

export const WeeklyMealsSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedWeeklyMeals, setEditedWeeklyMeals] =
    useState<WeeklyMeals | null>(null);
  const [selectionDrafts, setSelectionDrafts] = useState<
    Record<string, string>
  >({});

  const { meals, fetchMeals } = useMeals();
  const {
    weeklyMeals,
    fetchWeeklyMeals,
    createWeeklyMeals,
    clearWeeklyMeals,
    startingDay,
    fetchStartingDay,
    loading,
  } = useWeeklyMeals();

  const buildInitialEditState = (data: WeeklyMeals | null) => {
    const baseMeals = Object.fromEntries(
      WEEK_DAYS.map((day) => [day, data?.[day] ?? { name: "" }]),
    ) as WeeklyMeals;

    const nextSelectionDrafts = WEEK_DAYS.reduce(
      (acc, day) => {
        const meal = data?.[day];
        if (meal?.id) {
          acc[day] = meal.id;
        } else if (meal?.name) {
          acc[day] = meal.name;
        } else {
          acc[day] = "";
        }
        return acc;
      },
      {} as Record<string, string>,
    );
    setEditedWeeklyMeals(baseMeals);
    setSelectionDrafts(nextSelectionDrafts);
  };

  useEffect(() => {
    void fetchMeals();
    void fetchWeeklyMeals();
    void fetchStartingDay();
  }, [fetchMeals, fetchWeeklyMeals, fetchStartingDay]);

  useEffect(() => {
    if (weeklyMeals) {
      buildInitialEditState(weeklyMeals);
    }
  }, [weeklyMeals]);

  const activeWeeklyMeals = isEditing ? editedWeeklyMeals : weeklyMeals;
  const days = Object.keys(activeWeeklyMeals ?? {}).filter(
    (day) => activeWeeklyMeals?.[day].name,
  );
  const sortedDays = sortDays(days, startingDay || "Monday");
  const daysToRender = isEditing
    ? sortDays([...WEEK_DAYS], startingDay || "Monday")
    : sortedDays;

  const handleEditStart = () => {
    if (!weeklyMeals) return;
    buildInitialEditState(weeklyMeals);
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    if (!weeklyMeals) {
      setIsEditing(false);
      return;
    }
    buildInitialEditState(weeklyMeals);
    setIsEditing(false);
  };

  const handleMealSelectChange = (day: string, value: string) => {
    setSelectionDrafts((prev) => ({ ...prev, [day]: value }));

    setEditedWeeklyMeals((prev) => {
      if (!prev) return prev;

      if (!value) {
        return {
          ...prev,
          [day]: { name: "" },
        };
      }

      const selectedMeal = meals?.find((meal) => meal.id === value);
      return {
        ...prev,
        [day]: selectedMeal
          ? { id: selectedMeal.id, name: selectedMeal.name }
          : { name: value },
      };
    });
  };

  const handleSave = async () => {
    if (!editedWeeklyMeals) return;

    const persistableWeeklyMeals = Object.entries(editedWeeklyMeals).reduce(
      (acc, [day, meal]) => {
        if (meal.name?.trim()) {
          acc[day] = meal;
        }
        return acc;
      },
      {} as WeeklyMeals,
    );

    await createWeeklyMeals(persistableWeeklyMeals);
    setIsEditing(false);
  };

  if (loading) {
    return <WeeklyMealsSectionSkeleton />;
  }

  return (
    <>
      {activeWeeklyMeals ? (
        <>
          <h2 className="text-sm font-medium tracking-wider text-gray-800 uppercase">
            Weekly Meals:
          </h2>

          <ul className="flex flex-col gap-2">
            {daysToRender.map((day) => {
              const mealObj = activeWeeklyMeals?.[day] ?? { name: "" };
              const meal = meals?.find((m) => m.id === mealObj.id);
              const currentSelection = isEditing
                ? (selectionDrafts[day] ?? "")
                : meal?.id
                  ? meal.id
                  : mealObj.name
                    ? mealObj.name
                    : "";

              return (
                <li key={day} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="min-w-26 rounded bg-orange-100 px-2 py-1 text-center">
                      {day}:
                    </span>{" "}
                    {isEditing ? (
                      <Combobox
                        id={`weekly-meal-${day.toLowerCase()}`}
                        placeholder="Search or enter a meal"
                        options={(meals ?? []).map((mealOption) => ({
                          value: mealOption.id,
                          label: mealOption.name,
                        }))}
                        value={currentSelection}
                        onValueChange={(value) =>
                          handleMealSelectChange(day, value)
                        }
                        label={`${day} meal`}
                        labelVisibility="sr-only"
                        allowCustomValue
                      />
                    ) : meal ? (
                      <Modal
                        triggerText={meal.name}
                        title={meal.name}
                        description={
                          <div className="flex flex-col gap-3">
                            <ul>
                              {meal.ingredients.map((ingredient) => (
                                <li key={ingredient.name}>
                                  {ingredient.name}{" "}
                                  <span className="text-sm text-gray-600">
                                    ({ingredient.quantity} x {ingredient.unit})
                                  </span>
                                </li>
                              ))}
                            </ul>
                            <Link
                              to={`/meals/${meal.id}/edit`}
                              className="flex items-center justify-center gap-1 self-start rounded bg-sky-100 px-3 py-1.5 text-sm font-normal text-sky-600">
                              <LuPencil /> Edit Meal
                            </Link>
                          </div>
                        }
                        triggerStyles="text-start"
                      />
                    ) : (
                      <span className="font-medium">{mealObj.name}</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-col gap-2">
            {isEditing ? (
              <>
                <Button color="primary" className="w-full" onClick={handleSave}>
                  Save Changes
                </Button>

                <Button
                  color="neutral"
                  className="w-full"
                  onClick={handleEditCancel}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Link to="/select-meals">
                  <Button className="w-full">
                    <LuCalendarPlus /> Select Meals
                  </Button>
                </Link>

                <Button
                  color="neutral"
                  className="w-full"
                  onClick={handleEditStart}>
                  <LuPencil /> Edit Meals
                </Button>

                <Separator.Root className="mx-auto my-1 h-[1px] w-12 bg-gray-300" />

                <ConfirmationDialog
                  trigger={
                    <Button color="danger">
                      <LuTrash2 /> Clear Meals
                    </Button>
                  }
                  title="Clear Meals?"
                  description="Are you sure you want to clear this week's meals? This action cannot be undone."
                  onConfirm={clearWeeklyMeals}
                />
              </>
            )}
          </div>
        </>
      ) : (
        <Link to="/select-meals">
          <Button className="w-full">
            <LuCalendarPlus /> Select Meals
          </Button>
        </Link>
      )}
    </>
  );
};
