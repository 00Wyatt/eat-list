import { useEffect } from "react";
import { Link } from "react-router";
import { LuCalendarPlus } from "react-icons/lu";
import { ShoppingList } from "@/components/ShoppingList";
import { useShoppingList } from "@/hooks";
import { useWeeklyMeals } from "@/hooks";
import { useMeals } from "@/hooks";
import { WeeklyMealsSection } from "@/components/WeeklyMealsSection";
import { Button } from "@/components/common/Button";

export const Home = () => {
  const { meals, fetchMeals } = useMeals();
  const {
    shoppingList,
    fetchShoppingList,
    clearShoppingList,
    removeShoppingListItem,
    toggleChecked,
  } = useShoppingList();
  const { weeklyMeals, fetchWeeklyMeals, clearWeeklyMeals } = useWeeklyMeals();

  useEffect(() => {
    fetchMeals();
    fetchWeeklyMeals();
    fetchShoppingList();
  }, []);

  const handleClearWeeklyMeals = () => {
    clearWeeklyMeals();
    clearShoppingList();
  };

  const showShoppingList = shoppingList && shoppingList.length > 0;

  return (
    <div className="flex flex-col gap-4 p-5">
      {showShoppingList && (
        <>
          <ShoppingList
            shoppingList={shoppingList}
            onRemove={removeShoppingListItem}
            onToggleChecked={toggleChecked}
            clearShoppingList={clearShoppingList}
          />
        </>
      )}
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
