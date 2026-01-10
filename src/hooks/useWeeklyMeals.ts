import { useState, useCallback } from "react";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useDoc } from "./useDoc";
import type { WeeklyMeals } from "@/types";

export function useWeeklyMeals() {
  const [weeklyMeals, setWeeklyMeals] = useState<WeeklyMeals | null>(null);
  const [startingDay, setStartingDay] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchWeeklyMeals = useCallback(async () => {
    setLoading(true);
    const data = await useDoc("weeklyMeals", "current");
    setWeeklyMeals(data ?? null);
    setLoading(false);
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

  const fetchStartingDay = useCallback(async () => {
    setLoading(true);
    const data = await useDoc("weeklyMeals", "startingDay");
    setStartingDay(data?.day ?? null);
    setLoading(false);
    return data ?? null;
  }, []);

  const storeStartingDay = useCallback(async (data: { day: string }) => {
    await setDoc(doc(db, "weeklyMeals", "startingDay"), data);
    setStartingDay(data.day);
    return data;
  }, []);

  return {
    weeklyMeals,
    fetchWeeklyMeals,
    createWeeklyMeals,
    clearWeeklyMeals,
    startingDay,
    fetchStartingDay,
    storeStartingDay,
    loading,
  };
}
