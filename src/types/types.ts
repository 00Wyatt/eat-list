export type Ingredient = {
  name: string;
  quantity: number;
  unit: string;
};

export type Meal = {
  id: string;
  name: string;
  ingredients: Ingredient[];
};

export type WeeklyMeals = Record<string, string>;

export type ShoppingListItem = {
  checked: boolean;
  name: string;
  quantity: number;
  quantityRounded: number;
  unit: string;
};
