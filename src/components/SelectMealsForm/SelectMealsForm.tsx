import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSelect } from "./components/FormSelect";
import { useMeals, useShoppingList, useWeeklyMeals } from "@/hooks";
import { Button } from "../common/Button";
import { LuSparkles } from "react-icons/lu";

const schema = z.object({
  Monday: z.string(),
  Tuesday: z.string(),
  Wednesday: z.string(),
  Thursday: z.string(),
  Friday: z.string(),
  Saturday: z.string(),
  Sunday: z.string(),
});

export type SelectMealsFormData = z.infer<typeof schema>;

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const SelectMealsForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setError,
    watch,
  } = useForm<SelectMealsFormData>({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();

  const { meals, fetchMeals } = useMeals();
  const { createWeeklyMeals } = useWeeklyMeals();
  const { createShoppingList } = useShoppingList();

  const [customMeals, setCustomMeals] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchMeals();
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

      setSuccessMessage("Meals selected successfully!");

      await createShoppingList(weeklyMealsList, meals);
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
              type="text"
              placeholder="Enter meal name"
              value={customMeals[day] || ""}
              onChange={(e) => handleCustomMealChange(day, e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 p-2"
            />
          )}
        </div>
      ))}
      <Button type="submit" size="large" className="mt-2">
        <LuSparkles /> Create List
      </Button>
      {errors.root && (
        <p className="text-red-600">
          {errors.root?.message && errors.root.message}
        </p>
      )}
      {successMessage && (
        <>
          <p className="text-green-600">{successMessage}</p>
        </>
      )}
    </form>
  );
};
