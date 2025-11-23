import type { ShoppingListItem } from "@/types";
import { ShoppingListItemComponent } from "./components/ShoppingListItemComponent";
import { ConfirmationDialog } from "../common/ConfirmationDialog";

type ShoppingListProps = {
  shoppingList: ShoppingListItem[];
  onRemove: (itemName: string) => void;
  onToggleChecked: (itemName: string) => void;
  clearShoppingList: () => void;
};

export const ShoppingList = ({
  shoppingList,
  onRemove,
  onToggleChecked,
  clearShoppingList,
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
      <ConfirmationDialog
        triggerText="Clear List"
        title="Clear Shopping List?"
        description="Are you sure you want to clear the shopping list? This action cannot be undone."
        onConfirm={clearShoppingList}
        triggerStyles="self-start"
      />
    </div>
  );
};
