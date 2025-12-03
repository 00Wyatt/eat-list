import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/common/Button";
import { parseShoppingListInput } from "../helpers/parseShoppingListInput";
import type { ShoppingListItem } from "@/types";

const schema = z.object({
  item: z.string().min(1, "Please enter an item name"),
});

type AddItemInput = z.infer<typeof schema>;

export const ShoppingListAddItem = ({
  onAdd,
  onCancel,
}: {
  onAdd: (value: ShoppingListItem) => void;
  onCancel: () => void;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddItemInput>({
    resolver: zodResolver(schema),
  });

  const submit = (data: AddItemInput) => {
    const parsedItem = parseShoppingListInput(data.item);
    onAdd(parsedItem);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          onCancel();
          reset();
        }
      }}
      tabIndex={-1}
      className="flex flex-col gap-2">
      <input
        {...register("item")}
        autoFocus
        className="my-[1px] flex-1 rounded border border-gray-300 px-2 py-1.5"
        placeholder="Enter a value"
      />
      <Button type="submit" className="px-4">
        Add
      </Button>
      {errors.item && (
        <span className="text-red-600">{errors.item.message}</span>
      )}
    </form>
  );
};
