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

export const SelectMealsForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setError,
  } = useForm<SelectMealsFormData>({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { meals, fetchMeals } = useMeals();
  const { createWeeklyMeals } = useWeeklyMeals();
  const { createShoppingList } = useShoppingList();

  useEffect(() => {
    fetchMeals();
  }, []);

  const onSubmit = async (data: SelectMealsFormData) => {
    clearErrors("root");

    const hasMealSelected = Object.values(data).some(
      (value) => typeof value === "string" && value.length > 0,
    );

    if (!hasMealSelected) {
      setError("root", {
        type: "manual",
        message: "Select at least one meal",
      });
      return;
    }

    try {
      const weeklyMealsList = await createWeeklyMeals(data);

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
      <FormSelect
        id="monday"
        label="Monday"
        placeholder="Select a meal for Monday"
        mealList={meals ?? []}
        register={register("Monday")}
      />
      <FormSelect
        id="tuesday"
        label="Tuesday"
        placeholder="Select a meal for Tuesday"
        mealList={meals ?? []}
        register={register("Tuesday")}
      />
      <FormSelect
        id="wednesday"
        label="Wednesday"
        placeholder="Select a meal for Wednesday"
        mealList={meals ?? []}
        register={register("Wednesday")}
      />
      <FormSelect
        id="thursday"
        label="Thursday"
        placeholder="Select a meal for Thursday"
        mealList={meals ?? []}
        register={register("Thursday")}
      />
      <FormSelect
        id="friday"
        label="Friday"
        placeholder="Select a meal for Friday"
        mealList={meals ?? []}
        register={register("Friday")}
      />
      <FormSelect
        id="saturday"
        label="Saturday"
        placeholder="Select a meal for Saturday"
        mealList={meals ?? []}
        register={register("Saturday")}
      />
      <FormSelect
        id="sunday"
        label="Sunday"
        placeholder="Select a meal for Sunday"
        mealList={meals ?? []}
        register={register("Sunday")}
      />
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
