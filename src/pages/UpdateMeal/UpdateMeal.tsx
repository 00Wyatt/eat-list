import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router";
import {
  MEAL_CATEGORIES,
  MealForm,
  mealFormSchema,
} from "@/components/MealForm";
import type { MealFormValues } from "@/components/MealForm";
import { db } from "../../../firebase";
import { useMeals } from "@/hooks";

type PageState =
  | { status: "loading" }
  | { status: "ready"; initialValues: MealFormValues }
  | { status: "error"; message: string };

const isMealCategory = (
  value: unknown,
): value is (typeof MEAL_CATEGORIES)[number] =>
  MEAL_CATEGORIES.some((category) => category === value);

const getMealFormValues = (data: unknown) => {
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return null;
  }

  const mealData = data as Record<string, unknown>;
  if (
    typeof mealData.name !== "string" ||
    !Array.isArray(mealData.ingredients)
  ) {
    return null;
  }

  const ingredients = mealData.ingredients.map((ingredient: unknown) => {
    if (typeof ingredient !== "object" || ingredient === null) return null;

    const values = ingredient as Record<string, unknown>;
    return {
      name: values.name,
      quantity: values.quantity,
      unit: values.unit,
      category: isMealCategory(values.category) ? values.category : "",
    };
  });

  if (ingredients.some((ingredient) => ingredient === null)) return null;

  const parsed = mealFormSchema.safeParse({
    name: mealData.name,
    ingredients,
  });
  return parsed.success ? parsed.data : null;
};

export const UpdateMeal = () => {
  const { mealId } = useParams();
  const navigate = useNavigate();
  const { updateMeal } = useMeals();
  const [pageState, setPageState] = useState<PageState>({ status: "loading" });

  useEffect(() => {
    let isCurrent = true;

    const loadMeal = async () => {
      if (!mealId) {
        setPageState({ status: "error", message: "Meal not found." });
        return;
      }

      try {
        const mealSnapshot = await getDoc(doc(db, "meals", mealId));
        if (!isCurrent) return;

        if (!mealSnapshot.exists()) {
          setPageState({ status: "error", message: "Meal not found." });
          return;
        }

        const initialValues = getMealFormValues(mealSnapshot.data());
        if (!initialValues) {
          setPageState({
            status: "error",
            message: "This meal has invalid or incomplete data.",
          });
          return;
        }

        setPageState({ status: "ready", initialValues });
      } catch (error) {
        console.error("Failed to load meal:", error);
        if (isCurrent) {
          setPageState({
            status: "error",
            message: "Unable to load this meal. Please try again.",
          });
        }
      }
    };

    void loadMeal();
    return () => {
      isCurrent = false;
    };
  }, [mealId]);

  const handleSubmit = async (values: MealFormValues) => {
    if (!mealId) return;

    try {
      await updateMeal(mealId, values);
      navigate("/");
    } catch (error) {
      console.error("Failed to update meal:", error);
      throw new Error("Unable to save this meal. Please try again.");
    }
  };

  return (
    <div className="flex w-full flex-col gap-3 p-5">
      <h2 className="mb-1 text-sm font-medium tracking-wider text-gray-800 uppercase">
        Update Meal
      </h2>
      {pageState.status === "loading" ? (
        <p role="status">Loading meal…</p>
      ) : pageState.status === "error" ? (
        <p role="alert" className="text-red-600">
          {pageState.message}
        </p>
      ) : (
        <MealForm
          initialValues={pageState.initialValues}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/")}
          submitLabel="Save Changes"
        />
      )}
    </div>
  );
};
