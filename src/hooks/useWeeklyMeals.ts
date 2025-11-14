import { useState, useCallback } from "react";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useDoc } from "./useDoc";
import type { WeeklyMeals } from "@/types";

export function useWeeklyMeals() {
  const [weeklyMeals, setWeeklyMeals] = useState<WeeklyMeals | null>(null);

  const fetchWeeklyMeals = useCallback(async () => {
    const data = await useDoc("weeklyMeals", "current");
    setWeeklyMeals(data ?? null);
    return data ?? null;
  }, []);

  const createWeeklyMeals = useCallback(async (data: WeeklyMeals) => {
    await setDoc(doc(db, "weeklyMeals", "current"), data);
    setWeeklyMeals(data);
    return data;
  }, []);

  const clearWeeklyMeals = useCallback(async () => {
    try {
      await deleteDoc(doc(db, "weeklyMeals", "current"));
      setWeeklyMeals(null);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return {
    weeklyMeals,
    fetchWeeklyMeals,
    createWeeklyMeals,
    clearWeeklyMeals,
  };
}
