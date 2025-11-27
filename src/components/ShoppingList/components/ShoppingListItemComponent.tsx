import { useRef } from "react";
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
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handlePressStart = () => {
    if (shoppingListItem.checked) {
      timerRef.current = setTimeout(() => {
        onToggleChecked();
        timerRef.current = null;
      }, 500);
    }
  };

  const handlePressEnd = () => {
    if (shoppingListItem.checked && timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleClick = () => {
    if (!shoppingListItem.checked) {
      onToggleChecked();
    }
  };

  const checkedListItemStyles = shoppingListItem.checked
    ? "line-through text-gray-500 bg-gray-50"
    : "";
  const checkedBoxStyles = shoppingListItem.checked ? "bg-sky-100" : "";

  return (
    <li
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onClick={handleClick}
      className={twMerge(
        "flex items-center gap-3 rounded-lg bg-sky-50 px-4 py-2 duration-100",
        checkedListItemStyles,
      )}>
      <Checkbox.Root
        id={shoppingListItem.name}
        checked={shoppingListItem.checked}
        className={twMerge(
          "flex h-5 min-w-5 items-center justify-center rounded bg-sky-200",
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
