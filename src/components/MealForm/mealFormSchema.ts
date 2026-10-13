import { z } from "zod";

export const MEAL_CATEGORIES = ["Produce", "Grocery", "Meat", "Dairy", "Freezer"] as const;

export const mealFormSchema = z.object({
  name: z.string().trim().min(1, "Please enter a meal name"),
  ingredients: z.array(
    z.object({
      name: z.string().trim().min(1, "Please enter an ingredient name"),
      quantity: z.number().min(0, "Quantity cannot be negative"),
      unit: z.string(),
      category: z
        .enum(MEAL_CATEGORIES)
        .or(z.literal(""))
        .nullable()
        .optional(),
    }),
  ),
});

export type MealFormValues = z.infer<typeof mealFormSchema>;
