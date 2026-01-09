import { useEffect } from "react";
import { Link } from "react-router";
import { LuCalendarPlus, LuTrash2 } from "react-icons/lu";
import { Modal } from "../Modal";
import { ConfirmationDialog } from "../common/ConfirmationDialog";
import { Button } from "../common/Button";
import type { Meal, WeeklyMeals } from "@/types";
import { sortDays } from "@/utils/helpers";
import { useWeeklyMeals } from "@/hooks";

type WeeklyMealsSectionProps = {
  meals: Meal[] | null;
  weeklyMeals: WeeklyMeals;
  clearWeeklyMeals: () => void;
};

export const WeeklyMealsSection = ({
  meals,
  weeklyMeals,
  clearWeeklyMeals,
}: WeeklyMealsSectionProps) => {
  const { fetchStartingDay, startingDay } = useWeeklyMeals();

  useEffect(() => {
    fetchStartingDay();
  }, []);

  const days = Object.keys(weeklyMeals).filter((day) => weeklyMeals[day].name);
  const sortedDays = sortDays(days, startingDay || "Monday");

  return (
    <>
      <h2 className="text-sm font-medium tracking-wider text-gray-800 uppercase">
        Weekly Meals:
      </h2>
      <ul className="flex flex-col gap-2">
        {sortedDays.map((day) => {
          const mealObj = weeklyMeals[day];
          const meal = meals?.find((m) => m.id === mealObj.id);
          return (
            <li key={day} className="flex items-center gap-2">
              <span className="min-w-26 rounded bg-orange-100 px-2 py-1 text-center">
                {day}:
              </span>{" "}
              {meal ? (
                <Modal
                  triggerText={meal.name}
                  title={meal.name}
                  description={
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
                  }
                />
              ) : (
                <>
                  <span className="font-medium">{mealObj.name}</span>
                </>
              )}
            </li>
          );
        })}
      </ul>
      <div className="flex flex-col gap-2">
        <Link to="/select-meals">
          <Button size="large" className="w-full">
            <LuCalendarPlus /> Select Meals
          </Button>
        </Link>
        <ConfirmationDialog
          trigger={
            <Button className="bg-red-100 text-rose-600">
              <LuTrash2 /> Clear Meals
            </Button>
          }
          title="Clear Meals?"
          description="Are you sure you want to clear this week's meals? This action cannot be undone."
          onConfirm={clearWeeklyMeals}
        />
      </div>
    </>
  );
};
