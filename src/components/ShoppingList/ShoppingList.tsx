import type { ShoppingListItem } from "@/types";
import { ShoppingListItemComponent } from "./components/ShoppingListItemComponent";

type ShoppingListProps = {
  shoppingList: ShoppingListItem[];
  onRemove: (itemName: string) => void;
  onToggleChecked: (itemName: string) => void;
};

export const ShoppingList = ({
  shoppingList,
  onRemove,
  onToggleChecked,
}: ShoppingListProps) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-medium">Shopping List</h2>
      <ul className="flex flex-col gap-1">
        {shoppingList.map((shoppingListItem) => (
          <ShoppingListItemComponent
            key={shoppingListItem.name}
            shoppingListItem={shoppingListItem}
            onRemove={() => onRemove(shoppingListItem.name)}
            onToggleChecked={() => onToggleChecked(shoppingListItem.name)}
          />
        ))}
      </ul>
    </div>
  );
};
