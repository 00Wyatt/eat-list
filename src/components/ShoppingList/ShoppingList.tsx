import { useEffect, useState } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import type { ShoppingListItem } from "@/types";
import { useShoppingList } from "@/hooks/useShoppingList";
import { ShoppingListItemComponent } from "./components/ShoppingListItemComponent";
import { ConfirmationDialog } from "../common/ConfirmationDialog";
import { Button } from "../common/Button";
import { ShoppingListAddItem } from "./components/ShoppingListAddItem";

export const ShoppingList = () => {
  const [showInput, setShowInput] = useState(false);

  const {
    shoppingList,
    fetchShoppingList,
    clearShoppingList,
    removeShoppingListItem,
    addShoppingListItem,
    toggleChecked,
  } = useShoppingList();

  useEffect(() => {
    fetchShoppingList();
  }, []);

  const handleAddItem = (item: ShoppingListItem) => {
    addShoppingListItem(item);
    setShowInput(false);
  };

  if (!shoppingList || shoppingList.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <h2 className="text-sm font-medium tracking-wider text-gray-800 uppercase">
        Shopping List
      </h2>
      <ul className="flex flex-col gap-2">
        {shoppingList.map((shoppingListItem) => (
          <ShoppingListItemComponent
            key={shoppingListItem.name}
            shoppingListItem={shoppingListItem}
            onRemove={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              removeShoppingListItem(shoppingListItem.name);
            }}
            onToggleChecked={() => toggleChecked(shoppingListItem.name)}
          />
        ))}
      </ul>
      {showInput ? (
        <ShoppingListAddItem
          onAdd={handleAddItem}
          onCancel={() => setShowInput(false)}
        />
      ) : (
        <div className="flex flex-col gap-2">
          <Button size="large" onClick={() => setShowInput(true)}>
            <LuPlus /> Add Item
          </Button>
          <ConfirmationDialog
            trigger={
              <Button color="danger">
                <LuTrash2 /> Clear List
              </Button>
            }
            title="Clear Shopping List?"
            description="Are you sure you want to clear the shopping list? This action cannot be undone."
            onConfirm={clearShoppingList}
          />
        </div>
      )}
    </div>
  );
};
