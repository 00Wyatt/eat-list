import type { ShoppingListItem } from "@/types";
import { ShoppingListItemComponent } from "./components/ShoppingListItemComponent";

type ShoppingListProps = {
  shoppingList: ShoppingListItem[];
};

export const ShoppingList = ({ shoppingList }: ShoppingListProps) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-medium">Shopping List</h2>
      <ul className="flex flex-col gap-1">
        {shoppingList.map((shoppingListItem) => (
          <ShoppingListItemComponent
            key={shoppingListItem.name}
            shoppingListItem={shoppingListItem}
          />
        ))}
      </ul>
    </div>
  );
};
