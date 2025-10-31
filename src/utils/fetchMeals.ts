import type { DocumentData } from "firebase/firestore";
import { useCollection } from "@/hooks/useCollection";

export const fetchMeals = async (
  setMeals: (mealsData: DocumentData[]) => void,
) => {
  const meals = useCollection("meals");
  const mealDocs = await meals;
  if (mealDocs) {
    setMeals(mealDocs.map((doc) => ({ id: doc.id, ...doc.data() })));
  }
};
