import { useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { Button } from "@/components/common/Buttons/Button";
import { Select } from "@/components/common/Select";
import { useIngredientSuggestions } from "@/hooks";
import {
  MEAL_CATEGORIES,
  mealFormSchema,
  type MealFormValues,
} from "./mealFormSchema";
import { Separator } from "radix-ui";

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
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MealFormValues>({
    resolver: zodResolver(mealFormSchema),
    defaultValues: initialValues,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });
  const ingredientValues = useWatch({ control, name: "ingredients" });
  const [activeIngredientIndex, setActiveIngredientIndex] = useState<
    number | null
  >(null);
  const activeIngredientName =
    activeIngredientIndex === null
      ? ""
      : (ingredientValues[activeIngredientIndex]?.name ?? "");
  const {
    suggestions,
    loading: suggestionsLoading,
    error: suggestionsError,
  } = useIngredientSuggestions(activeIngredientName);

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
    <form
      onSubmit={handleSubmit(submit)}
      onKeyDown={(event) => {
        if (event.key === "Enter" && event.target instanceof HTMLInputElement) {
          event.preventDefault();
        }
      }}
      className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label
          htmlFor="meal-name"
          className="text-sm font-medium text-gray-800">
          Name
        </label>
        <input
          id="meal-name"
          placeholder="Meal name"
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
                <div className="relative">
                  {(() => {
                    const ingredientInput = register(
                      `ingredients.${index}.name`,
                    );
                    const showSuggestions =
                      activeIngredientIndex === index &&
                      activeIngredientName.trim().length > 0;

                    return (
                      <>
                        <input
                          id={`ingredient-${index}`}
                          {...ingredientInput}
                          onFocus={() => setActiveIngredientIndex(index)}
                          onBlur={(event) => {
                            ingredientInput.onBlur(event);
                            setActiveIngredientIndex((current) =>
                              current === index ? null : current,
                            );
                          }}
                          placeholder="Ingredient"
                          className="w-full rounded border border-gray-300 px-2 py-1.5"
                          autoComplete="off"
                          role="combobox"
                          aria-autocomplete="list"
                          aria-expanded={showSuggestions}
                          aria-controls={`ingredient-suggestions-${index}`}
                        />
                        {showSuggestions && (
                          <div
                            id={`ingredient-suggestions-${index}`}
                            role="listbox"
                            aria-label="Ingredient suggestions"
                            className="absolute top-full left-0 z-20 mt-1 max-h-56 w-full overflow-y-auto rounded border border-gray-300 bg-white py-1 shadow-lg">
                            {suggestionsLoading ? (
                              <p
                                role="status"
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600">
                                <CgSpinner
                                  aria-hidden="true"
                                  className="animate-spin"
                                />
                                Searching meals…
                              </p>
                            ) : suggestionsError ? (
                              <p
                                role="alert"
                                className="px-3 py-2 text-sm text-red-600">
                                {suggestionsError}
                              </p>
                            ) : suggestions.length > 0 ? (
                              suggestions.map((suggestion) => (
                                <button
                                  key={suggestion.name.toLowerCase()}
                                  type="button"
                                  role="option"
                                  aria-selected="false"
                                  className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                  onMouseDown={(event) =>
                                    event.preventDefault()
                                  }
                                  onClick={() => {
                                    setValue(
                                      `ingredients.${index}.name`,
                                      suggestion.name,
                                      { shouldDirty: true },
                                    );
                                    setValue(
                                      `ingredients.${index}.quantity`,
                                      suggestion.quantity,
                                      { shouldDirty: true },
                                    );
                                    setValue(
                                      `ingredients.${index}.unit`,
                                      suggestion.unit,
                                      { shouldDirty: true },
                                    );
                                    setValue(
                                      `ingredients.${index}.category`,
                                      MEAL_CATEGORIES.find(
                                        (category) =>
                                          category === suggestion.category,
                                      ) ?? "",
                                      { shouldDirty: true },
                                    );
                                    setActiveIngredientIndex(null);
                                  }}>
                                  <span>{suggestion.name}</span>
                                  <span className="ml-3 text-xs text-gray-500">
                                    {suggestion.mealCount}{" "}
                                    {suggestion.mealCount === 1
                                      ? "meal"
                                      : "meals"}
                                  </span>
                                </button>
                              ))
                            ) : (
                              <p className="px-3 py-2 text-sm text-gray-600">
                                No matching ingredients.
                              </p>
                            )}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
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
                <Select
                  id={`ingredient-category-${index}`}
                  label={`Category for ingredient ${index + 1}`}
                  labelVisibility="sr-only"
                  placeholder="Category"
                  register={register(`ingredients.${index}.category`)}
                  className="px-2 py-1.5"
                  options={MEAL_CATEGORIES.map((category) => ({
                    value: category,
                    label: category,
                  }))}
                />
              </div>
            </div>
          </div>
        ))}
        {typeof errors.ingredients?.message === "string" && (
          <p role="alert" className="text-sm text-red-600">
            {errors.ingredients.message}
          </p>
        )}
        <Button color="neutral" onClick={() => append(emptyIngredient)}>
          <LuPlus aria-hidden="true" /> Add Ingredient
        </Button>
      </fieldset>

      <Separator.Root className="mx-auto h-[1px] w-12 bg-gray-300" />

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
