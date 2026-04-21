import { buildShoppingList } from '../utils/shoppingList';
import type { Meal, WeeklyPlan } from '../types';

const meals: Meal[] = [
  { id: 'd1', name: 'Tacos', type: 'dinner', ingredients: ['beef', 'tortillas', 'avocado'], timesUsed: 0, lastUsed: null },
  { id: 'd2', name: 'Pasta', type: 'dinner', ingredients: ['noodles', 'tomatoes', 'basil'], timesUsed: 0, lastUsed: null },
  { id: 'b1', name: 'Oatmeal', type: 'breakfast', ingredients: ['oats', 'blueberries'], timesUsed: 0, lastUsed: null },
];

function makePlan(overrides?: Partial<WeeklyPlan>): WeeklyPlan {
  return {
    id: 'plan1',
    createdAt: '2025-01-01',
    finalized: false,
    days: [
      { day: 'Sun', breakfast: 'b1', lunch: null, lunchIsLeftover: false, dinner: 'd1' },
      { day: 'Mon', breakfast: 'b1', lunch: 'd1', lunchIsLeftover: true, dinner: 'd2' },
      { day: 'Tue', breakfast: 'b1', lunch: 'd2', lunchIsLeftover: true, dinner: 'd1' },
      { day: 'Wed', breakfast: 'b1', lunch: 'd1', lunchIsLeftover: true, dinner: 'd2' },
      { day: 'Thu', breakfast: 'b1', lunch: 'd2', lunchIsLeftover: true, dinner: 'd1' },
      { day: 'Fri', breakfast: 'b1', lunch: 'd1', lunchIsLeftover: true, dinner: 'd2' },
    ],
    ...overrides,
  };
}

describe('buildShoppingList', () => {
  it('returns empty for null plan', () => {
    expect(buildShoppingList(null, meals)).toEqual([]);
  });

  it('aggregates ingredients from dinners and breakfasts', () => {
    const plan = makePlan();
    const items = buildShoppingList(plan, meals);
    const names = items.map(i => i.name);
    expect(names).toContain('beef');
    expect(names).toContain('tortillas');
    expect(names).toContain('noodles');
    expect(names).toContain('oats');
    expect(names).toContain('blueberries');
  });

  it('does NOT include leftover lunch ingredients separately', () => {
    const plan = makePlan();
    const items = buildShoppingList(plan, meals);
    // Leftover lunches shouldn't add extra ingredient counts beyond what dinner already adds
    const beef = items.find(i => i.name === 'beef');
    // Tacos appears as dinner on Sun, Tue, Thu (3 times) but lunch on Mon, Wed, Fri are leftovers
    expect(beef!.count).toBe(3); // only from dinner slots
  });

  it('includes non-leftover lunch ingredients', () => {
    const plan: WeeklyPlan = {
      id: 'plan1',
      createdAt: '2025-01-01',
      finalized: false,
      days: [
        { day: 'Sun', breakfast: 'b1', lunch: null, lunchIsLeftover: false, dinner: 'd1' },
        { day: 'Mon', breakfast: 'b1', lunch: 'd2', lunchIsLeftover: false, dinner: 'd1' },
        { day: 'Tue', breakfast: null, lunch: null, lunchIsLeftover: true, dinner: null },
        { day: 'Wed', breakfast: null, lunch: null, lunchIsLeftover: true, dinner: null },
        { day: 'Thu', breakfast: null, lunch: null, lunchIsLeftover: true, dinner: null },
        { day: 'Fri', breakfast: null, lunch: null, lunchIsLeftover: true, dinner: null },
      ],
    };
    const items = buildShoppingList(plan, meals);
    const noodles = items.find(i => i.name === 'noodles');
    expect(noodles).toBeDefined();
    expect(noodles!.count).toBe(1); // from lunch override
  });

  it('deduplicates same ingredient from different meals', () => {
    const mealsWithDupe: Meal[] = [
      { id: 'd1', name: 'Tacos', type: 'dinner', ingredients: ['cilantro', 'beef'], timesUsed: 0, lastUsed: null },
      { id: 'd2', name: 'Bowl', type: 'dinner', ingredients: ['cilantro', 'rice'], timesUsed: 0, lastUsed: null },
    ];
    const plan: WeeklyPlan = {
      id: 'p', createdAt: '2025-01-01', finalized: false,
      days: [
        { day: 'Sun', breakfast: null, lunch: null, lunchIsLeftover: false, dinner: 'd1' },
        { day: 'Mon', breakfast: null, lunch: 'd1', lunchIsLeftover: true, dinner: 'd2' },
        { day: 'Tue', breakfast: null, lunch: null, lunchIsLeftover: true, dinner: null },
        { day: 'Wed', breakfast: null, lunch: null, lunchIsLeftover: true, dinner: null },
        { day: 'Thu', breakfast: null, lunch: null, lunchIsLeftover: true, dinner: null },
        { day: 'Fri', breakfast: null, lunch: null, lunchIsLeftover: true, dinner: null },
      ],
    };
    const items = buildShoppingList(plan, mealsWithDupe);
    const cilantro = items.find(i => i.name === 'cilantro');
    expect(cilantro!.count).toBe(2);
    expect(cilantro!.meals).toContain('Tacos');
    expect(cilantro!.meals).toContain('Bowl');
  });

  it('assigns categories to ingredients', () => {
    const plan = makePlan();
    const items = buildShoppingList(plan, meals);
    const avocado = items.find(i => i.name === 'avocado');
    expect(avocado!.category).toBe('Produce');
    const beef = items.find(i => i.name === 'beef');
    expect(beef!.category).toBe('Protein');
  });

  it('sorts items alphabetically', () => {
    const plan = makePlan();
    const items = buildShoppingList(plan, meals);
    const names = items.map(i => i.name);
    expect(names).toEqual([...names].sort());
  });
});
