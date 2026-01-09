import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox, Separator } from "radix-ui";
import { LuCheck, LuSparkles } from "react-icons/lu";
import { FormSelect } from "./components/FormSelect";
import { useMeals, useShoppingList, useWeeklyMeals } from "@/hooks";
import { Button } from "../common/Button";
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

export const SelectMealsForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setError,
    watch,
    control,
  } = useForm<SelectMealsFormData>({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();

  const { meals, fetchMeals } = useMeals();
  const { createWeeklyMeals, storeStartingDay } = useWeeklyMeals();
  const { shoppingList, fetchShoppingList, createShoppingList } =
    useShoppingList();

  const [customMeals, setCustomMeals] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchMeals();
    fetchShoppingList();
  }, []);

  const handleCustomMealChange = (day: string, value: string) => {
    setCustomMeals((prev) => ({ ...prev, [day]: value }));
  };

  const onSubmit = async (data: SelectMealsFormData) => {
    clearErrors("root");

    const weeklyMeals = Object.fromEntries(
      daysOfWeek.map((day) => {
        const selected = data[day as keyof SelectMealsFormData];
        if (selected === "__other__") {
          const name = customMeals[day]?.trim();
          return [day, name ? { name } : { name: "" }];
        }
        const meal = meals?.find((m) => m.id === selected);
        return [day, meal ? { id: meal.id, name: meal.name } : { name: "" }];
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
      return;
    }

    try {
      const weeklyMealsList = await createWeeklyMeals(weeklyMeals);
      await storeStartingDay({ day: data.startingDay || "Monday" });

      setSuccessMessage("Meals selected successfully!");

      await createShoppingList(
        weeklyMealsList,
        meals,
        shoppingList,
        data.keepCurrentList,
      );
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setError("root", {
        type: "manual",
        message:
          error instanceof Error
            ? error.message
            : "Failed to create weekly meals",
      });
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
          <FormSelect
            id={day.toLowerCase()}
            label={day}
            placeholder={`Select a meal for ${day}`}
            mealList={meals ?? []}
            register={register(day as keyof SelectMealsFormData)}
            extraOptions={[{ value: "__other__", label: "Other" }]}
          />
          {watch(day as keyof SelectMealsFormData) === "__other__" && (
            <input
              autoFocus
              type="text"
              placeholder="Enter meal name"
              value={customMeals[day] || ""}
              onChange={(e) => handleCustomMealChange(day, e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 p-2"
            />
          )}
        </div>
      ))}
      <Separator.Root className="my-2 h-[1px] w-full bg-gray-300" />
      <FormSelect
        id="startingDay"
        label="Starting Day"
        placeholder="Select a starting day (Optional)"
        register={register("startingDay" as keyof SelectMealsFormData)}
        extraOptions={startingDayOptions}
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
      <Button type="submit" size="large" className="mt-1">
        <LuSparkles /> Create List
      </Button>
      {errors.root && (
        <p className="mb-2 text-red-600">
          {errors.root?.message && errors.root.message}
        </p>
      )}
      {successMessage && (
        <>
          <p className="mb-2 text-green-600">{successMessage}</p>
        </>
      )}
    </form>
  );
};
