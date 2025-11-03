export type Ingredient = {
  name: string;
  quantity: number;
  quantityRounded?: number;
  unit: string;
};

export type Meal = {
  id: string;
  name: string;
  ingredients: Ingredient[];
};

export type WeeklyMeal = Record<string, string>;
