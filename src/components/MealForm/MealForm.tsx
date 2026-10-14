import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { Button } from "@/components/common/Buttons/Button";
import {
  MEAL_CATEGORIES,
  mealFormSchema,
  type MealFormValues,
} from "./mealFormSchema";

type MealFormProps = {
  initialValues: MealFormValues;
  onSubmit: (values: MealFormValues) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
  loading?: boolean;
};

const emptyIngredient: MealFormValues["ingredients"][number] = {
  name: "",
  quantity: 1,
  unit: "",
  category: "",
};

export const MealForm = ({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel,
  loading = false,
}: MealFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<MealFormValues>({
    resolver: zodResolver(mealFormSchema),
    defaultValues: initialValues,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  const submit = async (values: MealFormValues) => {
    try {
      await onSubmit(values);
    } catch (error) {
      setError("root", {
        type: "server",
        message:
          error instanceof Error
            ? error.message
            : "Unable to save this meal. Please try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label
          htmlFor="meal-name"
          className="text-sm font-medium text-gray-800">
          Name
        </label>
        <input
          id="meal-name"
          {...register("name")}
          className="w-full rounded border border-gray-300 p-2"
          autoComplete="off"
        />
        {errors.name && (
          <p role="alert" className="text-sm text-red-600">
            {errors.name.message}
          </p>
        )}
      </div>

      <fieldset className="flex flex-col gap-5">
        <legend className="mb-1 text-sm font-medium text-gray-800">
          Ingredients
        </legend>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_5rem] gap-2">
              <div className="min-w-0">
                <label htmlFor={`ingredient-${index}`} className="sr-only">
                  Ingredient {index + 1}
                </label>
                <input
                  id={`ingredient-${index}`}
                  {...register(`ingredients.${index}.name`)}
                  placeholder="Ingredient"
                  className="w-full rounded border border-gray-300 px-2 py-1.5"
                  autoComplete="off"
                />
                {errors.ingredients?.[index]?.name && (
                  <p role="alert" className="mt-1 text-xs text-red-600">
                    {errors.ingredients[index]?.name?.message}
                  </p>
                )}
              </div>
              <div className="min-w-0">
                <label
                  htmlFor={`ingredient-quantity-${index}`}
                  className="sr-only">
                  Quantity for ingredient {index + 1}
                </label>
                <input
                  id={`ingredient-quantity-${index}`}
                  type="number"
                  min="0"
                  step="any"
                  {...register(`ingredients.${index}.quantity`, {
                    valueAsNumber: true,
                  })}
                  className="w-full rounded border border-gray-300 px-2 py-1.5"
                  aria-label={`Quantity for ingredient ${index + 1}`}
                />
                {errors.ingredients?.[index]?.quantity && (
                  <p role="alert" className="mt-1 text-xs text-red-600">
                    {errors.ingredients[index]?.quantity?.message}
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => remove(index)}
              aria-label={`Remove ingredient ${index + 1}`}
              className="row-span-2 p-2 text-red-600">
              <LuTrash2 aria-hidden="true" />
            </Button>
            <div className="grid min-w-0 grid-cols-2 gap-2">
              <div className="min-w-0">
                <label htmlFor={`ingredient-unit-${index}`} className="sr-only">
                  Unit for ingredient {index + 1}
                </label>
                <input
                  id={`ingredient-unit-${index}`}
                  {...register(`ingredients.${index}.unit`)}
                  placeholder="Unit"
                  className="w-full rounded border border-gray-300 px-2 py-1.5"
                  autoComplete="off"
                />
              </div>
              <div className="min-w-0">
                <label
                  htmlFor={`ingredient-category-${index}`}
                  className="sr-only">
                  Category for ingredient {index + 1}
                </label>
                <select
                  id={`ingredient-category-${index}`}
                  {...register(`ingredients.${index}.category`)}
                  className="w-full rounded border border-gray-300 bg-white px-2 py-1.5">
                  <option value="">Category</option>
                  {MEAL_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
        {typeof errors.ingredients?.message === "string" && (
          <p role="alert" className="text-sm text-red-600">
            {errors.ingredients.message}
          </p>
        )}
        <Button
          color="neutral"
          onClick={() => append(emptyIngredient)}>
          <LuPlus aria-hidden="true" /> Add Ingredient
        </Button>
      </fieldset>

      {errors.root && (
        <p role="alert" className="text-sm text-red-600">
          {errors.root.message}
        </p>
      )}
      <div className="flex flex-col gap-2">
        <Button type="submit" loading={loading || isSubmitting}>
          {submitLabel}
        </Button>
        <Button color="neutral" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
