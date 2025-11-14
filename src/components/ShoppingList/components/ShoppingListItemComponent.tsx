import { useState } from "react";
import { Checkbox } from "radix-ui";
import { LuCheck } from "react-icons/lu";
import type { ShoppingListItem } from "@/types";

type ShoppingListItemProps = {
  shoppingListItem: ShoppingListItem;
};

export const ShoppingListItemComponent = ({
  shoppingListItem,
}: ShoppingListItemProps) => {
  const [checked, setChecked] = useState<Checkbox.CheckedState>(false);

  const checkedStyle = checked ? "line-through text-gray-500" : "";

  return (
    <li className={`flex items-center gap-2 ${checkedStyle}`}>
      <Checkbox.Root
        id={shoppingListItem.name}
        checked={checked}
        onCheckedChange={setChecked}
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
    </li>
  );
};
