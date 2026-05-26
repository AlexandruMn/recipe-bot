import { FALLBACK_RECIPES_PART1 } from "./recipes-fallback-part1";
import { FALLBACK_RECIPES_PART2 } from "./recipes-fallback-part2";
import { FALLBACK_RECIPES_PART3 } from "./recipes-fallback-part3";
import { FALLBACK_RECIPES_PART4 } from "./recipes-fallback-part4";

export interface FallbackRecipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  sourceUrl?: string;
  spoonacularSourceUrl?: string;
  extendedIngredients: {
    id: number;
    name: string;
    originalName: string;
    amount: number;
    unit: string;
  }[];
  analyzedInstructions: {
    steps: {
      number: number;
      step: string;
      equipment?: { name: string }[];
    }[];
  }[];
}

export const FALLBACK_RECIPES: FallbackRecipe[] = [
  ...FALLBACK_RECIPES_PART1,
  ...FALLBACK_RECIPES_PART2,
  ...FALLBACK_RECIPES_PART3,
  ...FALLBACK_RECIPES_PART4
];
