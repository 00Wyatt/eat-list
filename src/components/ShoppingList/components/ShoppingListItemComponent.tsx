import { Checkbox } from "radix-ui";
import { LuCheck, LuX } from "react-icons/lu";
import { twMerge } from "tailwind-merge";
import type { ShoppingListItem } from "@/types";

type ShoppingListItemProps = {
  shoppingListItem: ShoppingListItem;
  onRemove: () => void;
  onToggleChecked: () => void;
};

export const ShoppingListItemComponent = ({
  shoppingListItem,
  onRemove,
  onToggleChecked,
}: ShoppingListItemProps) => {
  const checkedListItemStyles = shoppingListItem.checked
    ? "line-through text-gray-500 bg-gray-50"
    : "";
  const checkedBoxStyles = shoppingListItem.checked ? "bg-sky-200" : "";

  return (
    <li
      className={twMerge(
        "flex items-center gap-3 rounded-lg bg-sky-50 px-4 py-2",
        checkedListItemStyles,
      )}>
      <Checkbox.Root
        id={shoppingListItem.name}
        checked={shoppingListItem.checked}
        onCheckedChange={onToggleChecked}
        className={twMerge(
          "flex h-5 min-w-5 items-center justify-center rounded bg-sky-300",
          checkedBoxStyles,
        )}>
        <Checkbox.Indicator className="text-black">
          <LuCheck />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label htmlFor={shoppingListItem.name}>
        <span className="font-medium text-gray-900">
          {shoppingListItem.quantityRounded} x {shoppingListItem.name}
        </span>{" "}
        <span className="text-sm text-gray-600">
          ({shoppingListItem.quantity} x {shoppingListItem.unit})
        </span>
      </label>
      {onRemove && (
        <button
          type="button"
          className="ml-auto cursor-pointer p-1 text-xl text-sky-900 hover:text-red-900"
          onClick={onRemove}>
          <LuX />
        </button>
      )}
    </li>
  );
};
