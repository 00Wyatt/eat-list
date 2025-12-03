import { useEffect } from "react";
import { Link } from "react-router";
import { LuCalendarPlus } from "react-icons/lu";
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
      {weeklyMeals ? (
        <WeeklyMealsSection
          meals={meals}
          weeklyMeals={weeklyMeals}
          clearWeeklyMeals={handleClearWeeklyMeals}
        />
      ) : (
        <p>No meals selected for this week.</p>
      )}
      {!weeklyMeals && (
        <Link to="/select-meals">
          <Button>
            <LuCalendarPlus /> Select Meals
          </Button>
        </Link>
      )}
    </div>
  );
};
