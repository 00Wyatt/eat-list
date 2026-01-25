import { useState } from "react";
import { Checkbox } from "radix-ui";
import { LuCheck, LuX } from "react-icons/lu";
import { twMerge } from "tailwind-merge";
import type { ShoppingListItem } from "@/types";
import { ShoppingListItemActionsMenu } from "./ShoppingListItemActionsMenu";

type ShoppingListItemProps = {
  shoppingListItem: ShoppingListItem;
  onRemove: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onToggleChecked: (checked: boolean, revert: () => void) => void;
  onChangeQuantityRounded: (delta: number) => Promise<void>;
};

export const ShoppingListItemComponent = ({
  shoppingListItem,
  onRemove,
  onToggleChecked,
  onChangeQuantityRounded,
}: ShoppingListItemProps) => {
  const [checked, setChecked] = useState(shoppingListItem.checked);

  const handleListItemClick = () => {
    if (!checked) handleToggleChecked();
  };

  const handleCheckboxClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleToggleChecked();
  };

  const handleLabelClick = (e: React.MouseEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!checked) handleToggleChecked();
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
      onClick={handleListItemClick}
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
        )}
        onClick={handleCheckboxClick}>
        <Checkbox.Indicator className="text-black">
          <LuCheck />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label
        htmlFor={shoppingListItem.name}
        className="flex items-center gap-1 select-none"
        onClick={handleLabelClick}>
        <span className="font-medium text-gray-900">
          {shoppingListItem.quantityRounded} x {shoppingListItem.name}
        </span>
        {shoppingListItem.quantity > 0 && (
          <span className="text-sm text-gray-600">
            ({shoppingListItem.quantity} x {shoppingListItem.unit})
          </span>
        )}
      </label>
      <ShoppingListItemActionsMenu
        shoppingListItem={shoppingListItem}
        onChangeQuantityRounded={onChangeQuantityRounded}
      />
      {onRemove && (
        <button
          type="button"
          className="p-0.5 text-2xl text-sky-900"
          onClick={onRemove}>
          <LuX />
        </button>
      )}
    </li>
  );
};
