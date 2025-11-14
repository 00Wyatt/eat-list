import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { type DocumentData } from "firebase/firestore";
import { FormSelect } from "./components/FormSelect";
import type { Meal } from "@/types";
import { useShoppingList } from "@/hooks";
import { useWeeklyMeals } from "@/hooks";

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

type SelectMealsFormProps = {
  mealList: DocumentData[];
};

export const SelectMealsForm = ({ mealList }: SelectMealsFormProps) => {
  const { register, handleSubmit } = useForm<SelectMealsFormData>({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { createWeeklyMeals } = useWeeklyMeals();
  const { createShoppingList } = useShoppingList();

  const onSubmit = async (data: SelectMealsFormData) => {
    try {
      const weeklyMealsList = await createWeeklyMeals(data);

      setSuccessMessage("Meals selected successfully!");

      await createShoppingList(weeklyMealsList, mealList as Meal[]);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error(error);
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
        mealList={mealList}
        register={register("Monday")}
      />
      <FormSelect
        id="tuesday"
        label="Tuesday"
        placeholder="Select a meal for Tuesday"
        mealList={mealList}
        register={register("Tuesday")}
      />
      <FormSelect
        id="wednesday"
        label="Wednesday"
        placeholder="Select a meal for Wednesday"
        mealList={mealList}
        register={register("Wednesday")}
      />
      <FormSelect
        id="thursday"
        label="Thursday"
        placeholder="Select a meal for Thursday"
        mealList={mealList}
        register={register("Thursday")}
      />
      <FormSelect
        id="friday"
        label="Friday"
        placeholder="Select a meal for Friday"
        mealList={mealList}
        register={register("Friday")}
      />
      <FormSelect
        id="saturday"
        label="Saturday"
        placeholder="Select a meal for Saturday"
        mealList={mealList}
        register={register("Saturday")}
      />
      <FormSelect
        id="sunday"
        label="Sunday"
        placeholder="Select a meal for Sunday"
        mealList={mealList}
        register={register("Sunday")}
      />
      <button
        type="submit"
        className="cursor-pointer self-start border border-gray-500 p-2 hover:bg-gray-200">
        Create List
      </button>

      {successMessage && (
        <>
          <p className="text-green-600">{successMessage}</p>
          <p>Redirecting...</p>
        </>
      )}
    </form>
  );
};
