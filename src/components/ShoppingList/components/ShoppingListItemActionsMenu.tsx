import { useState } from "react";
import { Popover } from "radix-ui";
import { LuEllipsisVertical, LuMinus, LuPencil, LuPlus } from "react-icons/lu";
import type { ShoppingListItem } from "@/types";
import { ShoppingListEditItemName } from "./ShoppingListEditItemName";
import { Button } from "@/components/common/Buttons/Button";

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
  const [open, setOpen] = useState(false);
  const [quantityUpdating, setQuantityUpdating] = useState(false);
  const [editingName, setEditingName] = useState(false);

  return (
    <Popover.Root
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) setEditingName(false);
      }}>
      <Popover.Trigger asChild>
        <Button
          variant="ghost"
          className="ml-auto p-1 text-xl text-sky-900"
          aria-label={`Item actions for ${shoppingListItem.name}`}
          onClick={(e) => e.stopPropagation()}>
          <LuEllipsisVertical />
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="z-50 flex w-48 flex-col gap-3 rounded-lg border border-gray-100 bg-white p-3 text-gray-900 shadow-lg"
          sideOffset={8}
          align="end"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between gap-2">
            <Button
              className="h-8 w-8 bg-sky-50 text-sky-900"
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
            </Button>
            <div className="flex flex-1 items-center justify-center text-sm font-medium">
              Qty: {shoppingListItem.quantityRounded}
            </div>
            <Button
              className="h-8 w-8 bg-sky-50 text-sky-900"
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
            </Button>
          </div>
          {editingName ? (
            <ShoppingListEditItemName
              initialName={shoppingListItem.name}
              onSave={async (nextName) => {
                await onRenameItemName(nextName);
                setEditingName(false);
                setOpen(false);
              }}
              onCancel={() => {
                setEditingName(false);
                setOpen(false);
              }}
            />
          ) : (
            <Button
              color="neutral"
              size="small"
              className="w-full px-2 py-1.5"
              onClick={(e) => {
                e.stopPropagation();
                setEditingName(true);
              }}>
              <LuPencil />
              Edit Item Name
            </Button>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
