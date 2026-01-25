import { useEffect, useState } from "react";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import type { ShoppingListItem } from "@/types";
import { useShoppingList } from "@/hooks/useShoppingList";
import { ShoppingListItemComponent } from "./components/ShoppingListItemComponent";
import { ConfirmationDialog } from "../common/ConfirmationDialog";
import { Button } from "../common/Button";
import { ShoppingListAddItem } from "./components/ShoppingListAddItem";
import { ShoppingListSkeleton } from "./components/ShoppingListSkeleton";

export const ShoppingList = () => {
  const [showInput, setShowInput] = useState(false);

  const {
    shoppingList,
    fetchShoppingList,
    clearShoppingList,
    removeShoppingListItem,
    addShoppingListItem,
    toggleChecked,
    changeQuantityRounded,
    loading,
  } = useShoppingList();

  useEffect(() => {
    fetchShoppingList();
  }, []);

  const handleAddItem = (item: ShoppingListItem) => {
    addShoppingListItem(item, () => setTimeout(() => fetchShoppingList(), 0));
    setShowInput(false);
  };

  if (loading) {
    return <ShoppingListSkeleton />;
  }

  if (!shoppingList || shoppingList.length === 0) {
    return (
      <>
        {showInput ? (
          <ShoppingListAddItem
            onAdd={handleAddItem}
            onCancel={() => setShowInput(false)}
          />
        ) : (
          <Button size="large" onClick={() => setShowInput(true)}>
            <LuPlus /> New Shopping List
          </Button>
        )}
      </>
    );
  }

  const groupedShoppingList = groupShoppingListItemsByCategory(shoppingList);

  return (
    <div className="flex w-full flex-col gap-4">
      <h2 className="text-sm font-medium tracking-wider text-gray-800 uppercase">
        Shopping List
      </h2>
      <div className="flex flex-col gap-4">
        {groupedShoppingList.map((group) => (
          <section key={group.category} className="flex flex-col gap-2">
            <h3 className="text-xs font-medium tracking-wider text-gray-700 uppercase">
              {group.category}
            </h3>
            <ul className="flex flex-col gap-2">
              {group.items.map((shoppingListItem) => (
                <ShoppingListItemComponent
                  key={shoppingListItem.name}
                  shoppingListItem={shoppingListItem}
                  onRemove={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    removeShoppingListItem(shoppingListItem.name, () =>
                      setTimeout(() => fetchShoppingList(), 0),
                    );
                  }}
                  onToggleChecked={async (_checked, revert) => {
                    try {
                      await toggleChecked(shoppingListItem.name);
                    } catch {
                      revert();
                    }
                  }}
                  onChangeQuantityRounded={async (delta) => {
                    await changeQuantityRounded(shoppingListItem.name, delta);
                  }}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
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

/*** Local Helpers ***/

type ShoppingListCategoryGroup = {
  category: string;
  items: ShoppingListItem[];
};

function normalizeCategory(
  category: ShoppingListItem["category"],
): string | null {
  if (typeof category !== "string") return null;
  const trimmed = category.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function groupShoppingListItemsByCategory(
  items: ShoppingListItem[],
): ShoppingListCategoryGroup[] {
  const miscLabel = "Misc";
  const miscItems: ShoppingListItem[] = [];

  const byCategoryKey = new Map<
    string,
    { label: string; items: ShoppingListItem[] }
  >();

  for (const item of items) {
    const normalized = normalizeCategory(item.category);
    if (normalized === null) {
      miscItems.push(item);
      continue;
    }

    const key = normalized.toLowerCase();
    const existing = byCategoryKey.get(key);
    if (existing) {
      existing.items.push(item);
    } else {
      byCategoryKey.set(key, { label: normalized, items: [item] });
    }
  }

  const groups: ShoppingListCategoryGroup[] = Array.from(byCategoryKey.values())
    .sort((a, b) =>
      b.label.localeCompare(a.label, undefined, { sensitivity: "base" }),
    )
    .map((g) => ({ category: g.label, items: g.items }));

  if (miscItems.length > 0) {
    groups.push({ category: miscLabel, items: miscItems });
  }

  return groups;
}
