import type { Meal, WeeklyPlan } from '../types';
import { categoryFor } from './data';

export interface ShoppingItem {
  name: string;
  count: number;
  meals: string[];
  category: string;
}

export function buildShoppingList(plan: WeeklyPlan | null, meals: Meal[]): ShoppingItem[] {
  if (!plan) return [];
  const byId = new Map(meals.map(m => [m.id, m]));
  const counts = new Map<string, { name: string; count: number; meals: Set<string> }>();

  const add = (mealId: string) => {
    const m = byId.get(mealId);
    if (!m) return;
    for (const ing of m.ingredients) {
      const key = ing.toLowerCase();
      if (!counts.has(key)) counts.set(key, { name: ing, count: 0, meals: new Set() });
      const v = counts.get(key)!;
      v.count += 1;
      v.meals.add(m.name);
    }
  };

  for (const d of plan.days) {
    if (d.breakfast) add(d.breakfast);
    if (d.dinner) add(d.dinner);
    if (d.lunch && !d.lunchIsLeftover) add(d.lunch);
  }

  return [...counts.values()].map(v => ({
    name: v.name,
    count: v.count,
    meals: [...v.meals],
    category: categoryFor(v.name),
  })).sort((a, b) => a.name.localeCompare(b.name));
}
