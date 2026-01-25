import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z
    .string()
    .transform((value) => value.trim())
    .refine((value) => value.length > 0, "Please enter an item name"),
});

type EditItemNameInput = z.infer<typeof schema>;

type ShoppingListEditItemNameProps = {
  initialName: string;
  onSave: (nextName: string) => Promise<void>;
  onCancel: () => void;
};

export const ShoppingListEditItemName = ({
  initialName,
  onSave,
  onCancel,
}: ShoppingListEditItemNameProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EditItemNameInput>({
    resolver: zodResolver(schema),
    defaultValues: { name: initialName },
  });

  useEffect(() => {
    reset({ name: initialName });
  }, [initialName, reset]);

  const submit = async (data: EditItemNameInput) => {
    try {
      await onSave(data.name);
    } catch (err) {
      setError("name", {
        type: "server",
        message: err instanceof Error ? err.message : "Rename failed.",
      });
    }
  };

  const cancel = () => {
    onCancel();
    reset({ name: initialName });
  };

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={handleSubmit(submit)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          cancel();
        }
      }}
      tabIndex={-1}
      onClick={(e) => e.stopPropagation()}>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-700">Item name</label>
        <input
          {...register("name")}
          autoFocus
          className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
        />
        {errors.name && (
          <p className="text-xs text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 rounded bg-sky-100 px-2 py-1 text-sm font-medium text-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}>
          Save
        </button>
        <button
          type="button"
          className="flex-1 rounded bg-gray-100 px-2 py-1 text-sm font-medium text-gray-800"
          onClick={(e) => {
            e.stopPropagation();
            cancel();
          }}>
          Cancel
        </button>
      </div>
    </form>
  );
};
