import { useEffect } from "react";
import { Link } from "react-router";
import { LuCalendarPlus } from "react-icons/lu";
import { Separator } from "radix-ui";
import { ShoppingList } from "@/components/ShoppingList";
import { useWeeklyMeals } from "@/hooks";
import { useMeals } from "@/hooks";
import { WeeklyMealsSection } from "@/components/WeeklyMealsSection";
import { Button } from "@/components/common/Button";

export const Home = () => {
  const { meals, fetchMeals } = useMeals();
  const { weeklyMeals, fetchWeeklyMeals, clearWeeklyMeals } = useWeeklyMeals();

  useEffect(() => {
    fetchMeals();
    fetchWeeklyMeals();
  }, []);

  const handleClearWeeklyMeals = () => {
    clearWeeklyMeals();
  };

  return (
    <div className="flex flex-col gap-4 p-5">
      <ShoppingList />
      <Separator.Root className="my-2 h-[1px] w-full bg-gray-300" />
      {weeklyMeals ? (
        <WeeklyMealsSection
          meals={meals}
          weeklyMeals={weeklyMeals}
          clearWeeklyMeals={handleClearWeeklyMeals}
        />
      ) : (
        <Link to="/select-meals">
          <Button size="large" className="w-full">
            <LuCalendarPlus /> Select Meals
          </Button>
        </Link>
      )}
    </div>
  );
};
