export interface FridgeState {
  meat: string;
  veg: string;
  staple: string;
}

export interface DishOption {
  name: string;
  description: string;
  calories: number; // Estimated
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface RecipeStep {
  instruction: string;
  timeInSeconds: number; // 0 if no timer needed
}

export interface Ingredient {
  item: string;
  amount: string;
  isOptional: boolean;
}

export interface Recipe {
  name: string;
  description: string;
  tags: string[];
  ingredients: Ingredient[];
  steps: RecipeStep[];
}

export enum AppStep {
  INPUT = 1,
  SELECTION = 2,
  COOKING = 3
}

export type Language = 'zh' | 'en';
