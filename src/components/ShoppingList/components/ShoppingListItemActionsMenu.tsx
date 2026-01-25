import { useState } from "react";
import { Popover } from "radix-ui";
import { LuEllipsisVertical, LuMinus, LuPencil, LuPlus } from "react-icons/lu";
import type { ShoppingListItem } from "@/types";
import { ShoppingListEditItemName } from "./ShoppingListEditItemName";

type ShoppingListItemActionsMenuProps = {
  shoppingListItem: ShoppingListItem;
  onChangeQuantityRounded: (delta: number) => Promise<void>;
  onRenameItemName: (nextName: string) => Promise<void>;
};

export const ShoppingListItemActionsMenu = ({
  shoppingListItem,
  onChangeQuantityRounded,
  onRenameItemName,
}: ShoppingListItemActionsMenuProps) => {
  const [quantityUpdating, setQuantityUpdating] = useState(false);
  const [editingName, setEditingName] = useState(false);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="ml-auto rounded p-1 text-xl text-sky-900"
          aria-label={`Item actions for ${shoppingListItem.name}`}
          onClick={(e) => e.stopPropagation()}>
          <LuEllipsisVertical />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="z-50 flex w-48 flex-col gap-2 rounded-lg border border-gray-100 bg-white p-2.5 text-gray-900 shadow-lg"
          sideOffset={8}
          align="end"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded bg-sky-50 text-sky-900 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Decrease quantity"
              disabled={
                quantityUpdating || shoppingListItem.quantityRounded <= 1
              }
              onClick={async (e) => {
                e.stopPropagation();
                setQuantityUpdating(true);
                try {
                  await onChangeQuantityRounded(-1);
                } finally {
                  setQuantityUpdating(false);
                }
              }}>
              <LuMinus />
            </button>
            <div className="flex flex-1 items-center justify-center text-sm font-medium">
              Qty: {shoppingListItem.quantityRounded}
            </div>
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded bg-sky-50 text-sky-900 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Increase quantity"
              disabled={quantityUpdating}
              onClick={async (e) => {
                e.stopPropagation();
                setQuantityUpdating(true);
                try {
                  await onChangeQuantityRounded(1);
                } finally {
                  setQuantityUpdating(false);
                }
              }}>
              <LuPlus />
            </button>
          </div>
          {editingName ? (
            <ShoppingListEditItemName
              initialName={shoppingListItem.name}
              onSave={async (nextName) => {
                await onRenameItemName(nextName);
                setEditingName(false);
              }}
              onCancel={() => setEditingName(false)}
            />
          ) : (
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded bg-gray-100 px-2 py-1 text-sm font-medium text-gray-800"
              onClick={(e) => {
                e.stopPropagation();
                setEditingName(true);
              }}>
              <LuPencil />
              Edit item name
            </button>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
