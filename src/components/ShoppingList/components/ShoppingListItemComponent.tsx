import { useRef, useState } from "react";
import { Checkbox } from "radix-ui";
import { LuCheck, LuX } from "react-icons/lu";
import { twMerge } from "tailwind-merge";
import type { ShoppingListItem } from "@/types";

type ShoppingListItemProps = {
  shoppingListItem: ShoppingListItem;
  onRemove: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onToggleChecked: (checked: boolean, revert: () => void) => void;
};

export const ShoppingListItemComponent = ({
  shoppingListItem,
  onRemove,
  onToggleChecked,
}: ShoppingListItemProps) => {
  const [checked, setChecked] = useState(shoppingListItem.checked);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handlePressStart = () => {
    if (checked) {
      timerRef.current = setTimeout(() => {
        handleToggleChecked();
        timerRef.current = null;
      }, 300);
    }
  };

  const handlePressEnd = () => {
    if (checked && timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleClick = () => {
    if (!checked) {
      handleToggleChecked();
    }
  };

  const handleToggleChecked = () => {
    const prevChecked = checked;
    setChecked(!prevChecked);
    onToggleChecked(!prevChecked, () => setChecked(prevChecked));
  };

  const checkedListItemStyles = checked
    ? "line-through text-gray-500 bg-gray-50"
    : "";
  const checkedBoxStyles = checked ? "bg-sky-100" : "";

  return (
    <li
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onClick={handleClick}
      className={twMerge(
        "flex items-center gap-3 rounded bg-sky-50 px-4 py-3 duration-100",
        checkedListItemStyles,
      )}>
      <Checkbox.Root
        id={shoppingListItem.name}
        checked={checked}
        className={twMerge(
          "flex h-5 min-w-5 items-center justify-center rounded bg-sky-200",
          checkedBoxStyles,
        )}>
        <Checkbox.Indicator className="text-black">
          <LuCheck />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label
        htmlFor={shoppingListItem.name}
        className="flex items-center gap-1 select-none">
        <span className="font-medium text-gray-900">
          {shoppingListItem.quantityRounded} x {shoppingListItem.name}
        </span>
        {shoppingListItem.quantity > 0 && (
          <span className="text-sm text-gray-600">
            ({shoppingListItem.quantity} x {shoppingListItem.unit})
          </span>
        )}
      </label>
      {onRemove && (
        <button
          type="button"
          className="ml-auto text-2xl text-sky-900"
          onClick={onRemove}>
          <LuX />
        </button>
      )}
    </li>
  );
};
