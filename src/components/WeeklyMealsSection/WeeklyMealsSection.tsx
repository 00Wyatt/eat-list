import { Separator } from "radix-ui";
import { LuAsterisk, LuCalendarPlus, LuTrash2 } from "react-icons/lu";
import { Modal } from "../Modal";
import { ConfirmationDialog } from "../common/ConfirmationDialog";
import { Button } from "../common/Button";
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
        {Object.entries(weeklyMeals).map(([day, mealObj]) => {
          if (!mealObj.name) return null;
          const meal = meals?.find((m) => m.id === mealObj.id);
          return (
            <li key={day} className="mb-1 flex items-center gap-2">
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
                        <li key={ingredient.name}>{ingredient.name}</li>
                      ))}
                    </ul>
                  }
                />
              ) : (
                <>
                  <span className="font-medium">{mealObj.name}</span>
                  <LuAsterisk className="ml-[-6px]" />
                </>
              )}
            </li>
          );
        })}
      </ul>
      <div className="flex flex-col gap-2">
        <Link to="/select-meals">
          <Button className="w-full">
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
