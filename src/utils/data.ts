import type { Meal } from '../types';
import { uid } from './uid';
import { parseCSV } from './csv';

export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const;
export const DAYS_LONG: Record<string, string> = {
  Sun: 'Sunday', Mon: 'Monday', Tue: 'Tuesday',
  Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday',
};

import seedCsvText from '../data/meals.csv?raw';

export function buildInitialMeals(): Meal[] {
  const parsed = parseCSV(seedCsvText);
  return parsed.map(m => ({
    id: uid(),
    name: m.name,
    type: m.type,
    ingredients: m.ingredients,
    timesUsed: 0,
    lastUsed: null,
  }));
}

export const CATEGORY_RULES: { name: string; match: RegExp }[] = [
  { name: 'Produce', match: /(pepper|broccoli|scallion|onion|avocado|cilantro|lime|lemon|garlic|mushroom|shallot|asparagus|potato|tomato|spinach|carrot|celery|basil|parsley|mint|cucumber|ginger|bok choy|brussels|sweet potato|apple|banana|strawberr|blueberr|raspberr|mango|chive|dill|rosemary|thai basil|chili|bell|orange|mixed berries|fresh fruit|sage)/i },
  { name: 'Protein', match: /(chicken|beef|pork|lamb|salmon|cod|shrimp|fish|turkey|tofu|egg|bacon|sausage|roast beef|rotisserie|lean ham)/i },
  { name: 'Pantry', match: /(soy sauce|miso|mirin|curry paste|coconut milk|tomatoes|beans|chickpeas|bamboo|sumac|turmeric|garam masala|tomato paste|wine|honey|maple|almond butter|almond milk|coconut flakes|salsa|san marzano|peanut butter|sesame oil|dried seaweed|tomato soup|cereal)/i },
  { name: 'Dairy', match: /(milk|yogurt|cheese|butter|cream|parmesan|mozzarella|feta|queso|cheddar|swiss)/i },
  { name: 'Grains & bread', match: /(rice|pasta|spaghetti|linguine|tortilla|pita|bread|sourdough|oats|granola|dough|flour|chia|waffle|biscuit|croissant)/i },
];

export function categoryFor(ing: string): string {
  const s = ing.toLowerCase();
  for (const c of CATEGORY_RULES) if (c.match.test(s)) return c.name;
  return 'Other';
}
