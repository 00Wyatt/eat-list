import { useNavigate } from "react-router";
import { MealForm } from "@/components/MealForm";
import type { MealFormValues } from "@/components/MealForm";
import { useMeals } from "@/hooks";

const initialValues: MealFormValues = {
  name: "",
  ingredients: [{ name: "", quantity: 1, unit: "", category: "" }],
};

export const CreateMeal = () => {
  const navigate = useNavigate();
  const { createMeal } = useMeals();

  const handleSubmit = async (values: MealFormValues) => {
    try {
      await createMeal(values);
      navigate("/meals");
    } catch (error) {
      console.error("Failed to create meal:", error);
      throw new Error("Unable to create this meal. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-5">
      <h2 className="text-sm font-medium tracking-wider text-gray-800 uppercase">
        Create Meal
      </h2>
      <MealForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/meals")}
        submitLabel="Create Meal"
      />
    </div>
  );
};
