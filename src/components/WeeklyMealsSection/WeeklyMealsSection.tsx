import { Separator } from "radix-ui";
import { LuCalendarPlus, LuTrash2 } from "react-icons/lu";
import { Modal } from "../Modal";
import { ConfirmationDialog } from "../common/ConfirmationDialog";
import { Button } from "../common/Button";
import { getMealById } from "@/utils/helpers";
import type { Meal, WeeklyMeals } from "@/types";
import { Link } from "react-router";

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
  return (
    <>
      <Separator.Root className="my-2 h-[1px] w-full bg-gray-300" />
      <h2 className="text-sm font-medium tracking-wider text-gray-800 uppercase">
        Weekly Meals:
      </h2>
      <ul className="flex flex-col gap-1">
        {Object.entries(weeklyMeals).map(([day, mealId]) => {
          const meal = getMealById(meals, mealId);
          return meal ? (
            <li key={day} className="mb-1 flex items-center gap-2">
              <span className="min-w-26 rounded bg-orange-100 px-2 py-1 text-center">
                {day}:
              </span>{" "}
              <Modal
                triggerText={meal.name}
                title={meal.name}
                description={
                  <ul>
                    {meal.ingredients.map((ingredient) => (
                      <li>{ingredient.name}</li>
                    ))}
                  </ul>
                }
              />
            </li>
          ) : null;
        })}
      </ul>
      <div className="flex justify-between">
        <Link to="/select-meals">
          <Button>
            <LuCalendarPlus /> Select Meals
          </Button>
        </Link>
        <ConfirmationDialog
          trigger={
            <Button className="self-end bg-red-100 px-2 py-1 text-rose-600">
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
