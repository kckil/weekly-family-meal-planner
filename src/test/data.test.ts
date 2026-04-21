import { buildInitialMeals, categoryFor, DAYS, DAYS_LONG } from '../utils/data';

describe('buildInitialMeals', () => {
  it('loads meals from the seed CSV', () => {
    const meals = buildInitialMeals();
    expect(meals.length).toBeGreaterThan(50);
  });

  it('contains both dinner and breakfast meals', () => {
    const meals = buildInitialMeals();
    const dinners = meals.filter(m => m.type === 'dinner');
    const breakfasts = meals.filter(m => m.type === 'breakfast');
    expect(dinners.length).toBeGreaterThan(50);
    expect(breakfasts.length).toBe(19);
  });

  it('all meals start with timesUsed 0 and lastUsed null', () => {
    const meals = buildInitialMeals();
    for (const m of meals) {
      expect(m.timesUsed).toBe(0);
      expect(m.lastUsed).toBeNull();
    }
  });

  it('all meals have unique ids', () => {
    const meals = buildInitialMeals();
    const ids = meals.map(m => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all meals have at least one ingredient', () => {
    const meals = buildInitialMeals();
    for (const m of meals) {
      expect(m.ingredients.length).toBeGreaterThan(0);
    }
  });

  it('includes known meals', () => {
    const meals = buildInitialMeals();
    const names = meals.map(m => m.name);
    expect(names).toContain('Chicken Tacos');
    expect(names).toContain('Bibimbap with Bulgogi');
    expect(names).toContain('Vietnamese Pork Chop');
  });
});

describe('categoryFor', () => {
  it('categorizes produce', () => {
    expect(categoryFor('broccoli')).toBe('Produce');
    expect(categoryFor('bell peppers')).toBe('Produce');
    expect(categoryFor('avocado')).toBe('Produce');
    expect(categoryFor('scallions')).toBe('Produce');
  });

  it('categorizes protein', () => {
    expect(categoryFor('chicken thighs')).toBe('Protein');
    expect(categoryFor('ground beef')).toBe('Protein');
    expect(categoryFor('shrimp')).toBe('Protein');
    expect(categoryFor('salmon fillets')).toBe('Protein');
  });

  it('categorizes dairy', () => {
    expect(categoryFor('cheddar')).toBe('Dairy');
    expect(categoryFor('mozzarella')).toBe('Dairy');
    expect(categoryFor('greek yogurt')).toBe('Dairy');
    expect(categoryFor('cream')).toBe('Dairy');
  });

  it('categorizes grains', () => {
    expect(categoryFor('corn tortillas')).toBe('Grains & bread');
    expect(categoryFor('rice')).toBe('Grains & bread');
    expect(categoryFor('pita')).toBe('Grains & bread');
  });

  it('categorizes pantry', () => {
    expect(categoryFor('soy sauce')).toBe('Pantry');
    expect(categoryFor('coconut milk')).toBe('Pantry');
    expect(categoryFor('black beans')).toBe('Pantry');
  });

  it('returns Other for unknown ingredients', () => {
    expect(categoryFor('xanthan gum')).toBe('Other');
  });
});

describe('constants', () => {
  it('DAYS has 6 entries Sun-Fri', () => {
    expect(DAYS).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  });

  it('DAYS_LONG maps all days', () => {
    for (const d of DAYS) {
      expect(DAYS_LONG[d]).toBeDefined();
      expect(DAYS_LONG[d].length).toBeGreaterThan(2);
    }
  });
});
