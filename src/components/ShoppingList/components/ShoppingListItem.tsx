import { useState } from "react";
import { Checkbox } from "radix-ui";
import { LuCheck } from "react-icons/lu";
import type { Ingredient } from "@/types";

type ShoppingListItemProps = {
  ingredient: Ingredient;
};

export const ShoppingListItem = ({ ingredient }: ShoppingListItemProps) => {
  const [checked, setChecked] = useState<Checkbox.CheckedState>(false);

  const checkedStyle = checked ? "line-through text-gray-500" : "";

  return (
    <li className={`flex items-center gap-2 ${checkedStyle}`}>
      <Checkbox.Root
        id={ingredient.name}
        checked={checked}
        onCheckedChange={setChecked}
        className="flex h-4 w-4 items-center justify-center rounded bg-gray-300">
        <Checkbox.Indicator className="text-black">
          <LuCheck />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label htmlFor={ingredient.name}>
        <span className="font-medium">
          {ingredient.quantityRounded} x {ingredient.name}
        </span>{" "}
        <span className="text-gray-600">
          ({ingredient.quantity} x {ingredient.unit})
        </span>
      </label>
    </li>
  );
};
