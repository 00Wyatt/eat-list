import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox, Separator } from "radix-ui";
import { LuCheck, LuSparkles } from "react-icons/lu";
import { Select } from "@/components/common/Select";
import { Combobox } from "../common/Combobox";
import { useMeals, useShoppingList, useWeeklyMeals } from "@/hooks";
import { Button } from "../common/Buttons/Button";
import { WEEK_DAYS as daysOfWeek } from "@/utils/helpers";

const schema = z.object({
  Monday: z.string(),
  Tuesday: z.string(),
  Wednesday: z.string(),
  Thursday: z.string(),
  Friday: z.string(),
  Saturday: z.string(),
  Sunday: z.string(),
  keepCurrentList: z.boolean(),
  startingDay: z.string(),
});

export type SelectMealsFormData = z.infer<typeof schema>;
type MealDay = Exclude<keyof SelectMealsFormData, "keepCurrentList" | "startingDay">;

export const SelectMealsForm = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setError,
    control,
  } = useForm<SelectMealsFormData>({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();

  const { meals, fetchMeals } = useMeals();
  const { createWeeklyMeals, storeStartingDay } = useWeeklyMeals();
  const { createShoppingList } = useShoppingList();

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const onSubmit = async (data: SelectMealsFormData) => {
    setLoading(true);
    clearErrors("root");

    const weeklyMeals = Object.fromEntries(
      daysOfWeek.map((day) => {
        const selected = data[day as MealDay];
        const meal = meals?.find((m) => m.id === selected);
        const customName = selected.trim();
        return [
          day,
          meal
            ? { id: meal.id, name: meal.name }
            : { name: customName },
        ];
      }),
    );

    const hasMealSelected = Object.values(weeklyMeals).some(
      (v) => v.name && v.name.length > 0,
    );

    if (!hasMealSelected) {
      setError("root", {
        type: "manual",
        message: "Please select at least one meal",
      });
      setLoading(false);
      return;
    }

    try {
      const weeklyMealsList = await createWeeklyMeals(weeklyMeals);
      await storeStartingDay({ day: data.startingDay || "Monday" });

      await createShoppingList(weeklyMealsList, meals, data.keepCurrentList);
      navigate("/");
    } catch (error) {
      setError("root", {
        type: "manual",
        message:
          error instanceof Error
            ? error.message
            : "Failed to create weekly meals",
      });
    } finally {
      setLoading(false);
    }
  };

  const startingDayOptions = daysOfWeek.map((day) => {
    return { value: day, label: day };
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-3">
      {daysOfWeek.map((day) => (
        <div key={day}>
          <Controller
            name={day as MealDay}
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Combobox
                id={day.toLowerCase()}
                label={day}
                placeholder="Search or enter a meal"
                options={(meals ?? []).map((meal) => ({
                  value: meal.id,
                  label: meal.name,
                }))}
                value={field.value}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                allowCustomValue
              />
            )}
          />
        </div>
      ))}
      <Separator.Root className="my-2 h-[1px] w-full bg-gray-300" />
      <Select
        id="startingDay"
        label="Starting Day"
        placeholder="Select a starting day (Optional)"
        register={register("startingDay")}
        options={startingDayOptions}
      />
      <label className="mt-1 flex items-center gap-2 self-start">
        <Controller
          name="keepCurrentList"
          control={control}
          defaultValue={true}
          render={({ field }) => (
            <Checkbox.Root
              checked={field.value}
              onCheckedChange={field.onChange}
              className={`flex h-5 min-w-5 items-center justify-center rounded border-2 border-sky-200 ${field.value ? "bg-sky-200" : ""}`}>
              <Checkbox.Indicator className="text-black">
                <LuCheck />
              </Checkbox.Indicator>
            </Checkbox.Root>
          )}
        />
        Keep existing shopping list items?
      </label>
      <Button type="submit" loading={loading} className="mt-1">
        <LuSparkles /> Create List
      </Button>
      {errors.root && (
        <p className="mb-2 text-red-600">
          {errors.root?.message && errors.root.message}
        </p>
      )}
    </form>
  );
};
