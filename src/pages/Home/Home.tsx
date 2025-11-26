import { useEffect } from "react";
import { Link } from "react-router";
import { Separator } from "radix-ui";
import { getMealById } from "@/utils/helpers";
import { ShoppingList } from "@/components/ShoppingList";
import { Modal } from "@/components/Modal";
import { useShoppingList } from "@/hooks";
import { useWeeklyMeals } from "@/hooks";
import { useMeals } from "@/hooks";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog/ConfirmationDialog";

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

  const showShoppingList = shoppingList && shoppingList.length > 0;

  return (
    <div className="flex flex-col items-start gap-4 p-5">
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
        <>
          <Separator.Root className="my-2 h-[1px] w-full bg-gray-300" />
          <h2 className="text-lg font-medium">This Week's Meals:</h2>
          <ul>
            {Object.entries(weeklyMeals).map(([day, mealId]) => {
              const meal = getMealById(meals, mealId);
              return meal ? (
                <li key={day}>
                  {day}:{" "}
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
          <ConfirmationDialog
            triggerText="Clear Meals"
            title="Clear Meals?"
            description="Are you sure you want to clear this week's meals? This action cannot be undone."
            onConfirm={() => {
              clearWeeklyMeals();
              clearShoppingList();
            }}
          />
        </>
      ) : (
        <p>No meals selected for this week.</p>
      )}
      <Link to="/select-meals" className="text-blue-500 hover:underline">
        {weeklyMeals ? "Select New Meals" : "Select This Week's Meals"}
      </Link>
    </div>
  );
};
