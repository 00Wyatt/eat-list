import { useEffect, useRef, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export type IngredientSuggestion = {
  name: string;
  mealCount: number;
  quantity: number;
  unit: string;
  category: string | null;
};

const getIngredientCounts = async (): Promise<IngredientSuggestion[]> => {
  const snapshot = await getDocs(collection(db, "meals"));
  const counts = new Map<string, IngredientSuggestion>();

  const meals = snapshot.docs.sort((first, second) =>
    String(first.data().name ?? "").localeCompare(
      String(second.data().name ?? ""),
    ),
  );

  meals.forEach((mealDoc) => {
    const ingredients: unknown = mealDoc.data().ingredients;
    if (!Array.isArray(ingredients)) return;

    const namesInMeal = new Set<string>();
    ingredients.forEach((ingredient: unknown) => {
      if (typeof ingredient !== "object" || ingredient === null) return;

      const name = (ingredient as Record<string, unknown>).name;
      if (typeof name !== "string" || !name.trim()) return;

      const normalizedName = name.trim().toLowerCase();
      if (namesInMeal.has(normalizedName)) return;
      namesInMeal.add(normalizedName);

      const existing = counts.get(normalizedName);
      if (existing) {
        existing.mealCount += 1;
      } else {
        const values = ingredient as Record<string, unknown>;
        const quantity = values.quantity;
        const unit = values.unit;
        const category = values.category;
        counts.set(normalizedName, {
          name: name.trim(),
          mealCount: 1,
          quantity:
            typeof quantity === "number" &&
            Number.isFinite(quantity) &&
            quantity >= 0
              ? quantity
              : 1,
          unit: typeof unit === "string" ? unit : "",
          category:
            typeof category === "string" || category === null
              ? category
              : null,
        });
      }
    });
  });

  return [...counts.values()].sort((a, b) => a.name.localeCompare(b.name));
};

export function useIngredientSuggestions(query: string) {
  const ingredientIndex = useRef<Promise<IngredientSuggestion[]> | null>(null);
  const [suggestions, setSuggestions] = useState<IngredientSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const normalizedQuery = query.trim().toLowerCase();

  useEffect(() => {
    if (!normalizedQuery) {
      setSuggestions([]);
      setLoading(false);
      setError(null);
      return;
    }

    let isCurrent = true;
    setLoading(true);
    setError(null);

    ingredientIndex.current ??= getIngredientCounts();
    void ingredientIndex.current
      .then((ingredients) => {
        if (!isCurrent) return;
        setSuggestions(
          ingredients
            .filter((ingredient) =>
              ingredient.name.toLowerCase().includes(normalizedQuery),
            )
            .slice(0, 8), // limit displayed suggestions to 8
        );
      })
      .catch((problem: unknown) => {
        console.error("Failed to load ingredient suggestions:", problem);
        ingredientIndex.current = null;
        if (isCurrent) {
          setSuggestions([]);
          setError(
            "Unable to load suggestions. Clear and re-enter your search to retry.",
          );
        }
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [normalizedQuery]);

  return { suggestions, loading, error };
}
