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
  startDay: string = "Monday",
): string[] {
  const startIndex = WEEK_DAYS.indexOf(startDay);
  const orderedDays = [
    ...WEEK_DAYS.slice(startIndex),
    ...WEEK_DAYS.slice(0, startIndex),
  ];
  return days
    .slice()
    .sort((a, b) => orderedDays.indexOf(a) - orderedDays.indexOf(b));
}
