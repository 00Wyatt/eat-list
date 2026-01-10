import type { Meal } from "@/types";

export const getMealById = (mealsList: Meal[] | null, id: string) => {
  const meal = mealsList?.find((m) => m.id === id);
  return meal;
};

export const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function sortDays(
  days: string[],
  startingDay: string = "Monday",
): string[] {
  const startingIndex = WEEK_DAYS.indexOf(startingDay);
  const orderedDays = [
    ...WEEK_DAYS.slice(startingIndex),
    ...WEEK_DAYS.slice(0, startingIndex),
  ];
  return days
    .slice()
    .sort((a, b) => orderedDays.indexOf(a) - orderedDays.indexOf(b));
}
