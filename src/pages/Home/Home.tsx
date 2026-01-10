import { Separator } from "radix-ui";
import { ShoppingList } from "@/components/ShoppingList";
import { WeeklyMealsSection } from "@/components/WeeklyMealsSection";

export const Home = () => {
  return (
    <div className="flex flex-col gap-4 p-5">
      <ShoppingList />
      <Separator.Root className="my-2 h-[1px] w-full bg-gray-300" />
      <WeeklyMealsSection />
    </div>
  );
};
