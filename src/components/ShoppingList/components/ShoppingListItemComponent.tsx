import { Checkbox } from "radix-ui";
import { LuCheck, LuX } from "react-icons/lu";
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
  const checkedStyle = shoppingListItem.checked
    ? "line-through text-gray-500"
    : "";

  return (
    <li className={`flex items-center gap-2 ${checkedStyle}`}>
      <Checkbox.Root
        id={shoppingListItem.name}
        checked={shoppingListItem.checked}
        onCheckedChange={onToggleChecked}
        className="flex h-4 w-4 items-center justify-center rounded bg-gray-300">
        <Checkbox.Indicator className="text-black">
          <LuCheck />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label htmlFor={shoppingListItem.name}>
        <span className="font-medium">
          {shoppingListItem.quantityRounded} x {shoppingListItem.name}
        </span>{" "}
        <span className="text-gray-600">
          ({shoppingListItem.quantity} x {shoppingListItem.unit})
        </span>
      </label>
      {onRemove && (
        <button
          type="button"
          className="cursor-pointer p-1 text-red-700 hover:text-red-900"
          onClick={onRemove}>
          <LuX />
        </button>
      )}
    </li>
  );
};
