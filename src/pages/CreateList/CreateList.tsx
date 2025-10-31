import { useEffect, useState } from "react";
import type { DocumentData } from "firebase/firestore";
import { useCollection } from "@/hooks/useCollection";
import { CreateListForm } from "@/components/CreateListForm/CreateListForm";

export const CreateList = () => {
  const meals = useCollection("meals");
  const [mealData, setMealData] = useState<DocumentData[]>([]);

  useEffect(() => {
    const fetchMeals = async () => {
      const mealDocs = await meals;
      if (mealDocs) {
        setMealData(mealDocs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    };

    fetchMeals();
  }, [meals]);

  return (
    <div className="p-8">
      <div className="flex max-w-80 flex-col gap-4">
        <h1 className="text-2xl font-medium">Select This Week's Meals</h1>
        <div>
          <CreateListForm mealList={mealData} />
        </div>
      </div>
    </div>
  );
};
