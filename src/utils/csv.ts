import type { Meal, MealType } from '../types';

export function parseCSV(text: string): { name: string; type: MealType; ingredients: string[] }[] {
  const out: { name: string; type: MealType; ingredients: string[] }[] = [];
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  for (const line of lines) {
    const i1 = line.indexOf(',');
    if (i1 < 0) continue;
    const i2 = line.indexOf(',', i1 + 1);
    if (i2 < 0) continue;
    const name = line.slice(0, i1).trim().replace(/^"|"$/g, '');
    const type = line.slice(i1 + 1, i2).trim().toLowerCase();
    const rest = line.slice(i2 + 1).trim().replace(/^"|"$/g, '');
    if (!/^(breakfast|dinner)$/.test(type)) continue;
    const ingredients = rest.split(';').map(x => x.trim()).filter(Boolean);
    if (!name) continue;
    out.push({ name, type: type as MealType, ingredients });
  }
  return out;
}

export function toCSV(meals: Meal[]): string {
  return meals.map(m => `${m.name}, ${m.type}, ${m.ingredients.join('; ')}`).join('\n');
}
