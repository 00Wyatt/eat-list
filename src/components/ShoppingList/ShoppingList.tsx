import type { Ingredient } from "@/types";
import { ShoppingListItem } from "./components/ShoppingListItem";

type ShoppingListProps = {
  shoppingList: Ingredient[];
};

export const ShoppingList = ({ shoppingList }: ShoppingListProps) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-medium">Shopping List</h2>
      <ul className="flex flex-col gap-1">
        {shoppingList.map((ingredient) => (
          <ShoppingListItem key={ingredient.name} ingredient={ingredient} />
        ))}
      </ul>
    </div>
  );
};
