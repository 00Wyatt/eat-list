import { ShoppingList } from "@/components/ShoppingList";

export const Home = () => {
  return (
    <div className="flex flex-col gap-4 p-5">
      <ShoppingList />
    </div>
  );
};
