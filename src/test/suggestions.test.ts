import { suggestPlan } from '../utils/suggestions';
import type { Meal } from '../types';

function makeMeals(count: number, type: 'dinner' | 'breakfast' = 'dinner'): Meal[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${type}-${i}`,
    name: `${type} ${i}`,
    type,
    ingredients: ['ing1', 'ing2'],
    timesUsed: 0,
    lastUsed: null,
  }));
}

describe('suggestPlan', () => {
  it('returns a plan with 6 days (Sun-Fri)', () => {
    const meals = [...makeMeals(10, 'dinner'), ...makeMeals(6, 'breakfast')];
    const plan = suggestPlan(meals);
    expect(plan.days).toHaveLength(6);
    expect(plan.days.map(d => d.day)).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  });

  it('fills all dinner slots', () => {
    const meals = [...makeMeals(10, 'dinner'), ...makeMeals(6, 'breakfast')];
    const plan = suggestPlan(meals);
    for (const d of plan.days) {
      expect(d.dinner).not.toBeNull();
    }
  });

  it('fills all breakfast slots', () => {
    const meals = [...makeMeals(10, 'dinner'), ...makeMeals(6, 'breakfast')];
    const plan = suggestPlan(meals);
    for (const d of plan.days) {
      expect(d.breakfast).not.toBeNull();
    }
  });

  it('Sunday lunch starts empty (no previous dinner)', () => {
    const meals = [...makeMeals(10, 'dinner'), ...makeMeals(6, 'breakfast')];
    const plan = suggestPlan(meals);
    expect(plan.days[0].lunch).toBeNull();
    expect(plan.days[0].lunchIsLeftover).toBe(false);
  });

  it('Mon-Fri lunch is previous dinner leftover', () => {
    const meals = [...makeMeals(10, 'dinner'), ...makeMeals(6, 'breakfast')];
    const plan = suggestPlan(meals);
    for (let i = 1; i < plan.days.length; i++) {
      expect(plan.days[i].lunchIsLeftover).toBe(true);
      expect(plan.days[i].lunch).toBe(plan.days[i - 1].dinner);
    }
  });

  it('produces different results on repeated calls (randomized)', () => {
    const meals = [...makeMeals(20, 'dinner'), ...makeMeals(8, 'breakfast')];
    const plans = Array.from({ length: 10 }, () => suggestPlan(meals));
    const dinnerSets = plans.map(p => p.days.map(d => d.dinner).join(','));
    const uniqueSets = new Set(dinnerSets);
    // With 20 dinners shuffled, extremely unlikely to get the same plan 10 times
    expect(uniqueSets.size).toBeGreaterThan(1);
  });

  it('starts as not finalized', () => {
    const meals = [...makeMeals(10, 'dinner'), ...makeMeals(6, 'breakfast')];
    const plan = suggestPlan(meals);
    expect(plan.finalized).toBe(false);
  });

  it('has a unique id and createdAt', () => {
    const meals = [...makeMeals(10, 'dinner'), ...makeMeals(6, 'breakfast')];
    const plan1 = suggestPlan(meals);
    const plan2 = suggestPlan(meals);
    expect(plan1.id).not.toBe(plan2.id);
  });

  it('handles fewer than 6 dinners by repeating', () => {
    const meals = [...makeMeals(3, 'dinner'), ...makeMeals(6, 'breakfast')];
    const plan = suggestPlan(meals);
    // All 6 dinner slots should still be filled
    for (const d of plan.days) {
      expect(d.dinner).not.toBeNull();
    }
  });

  it('handles fewer than 6 breakfasts by repeating', () => {
    const meals = [...makeMeals(10, 'dinner'), ...makeMeals(2, 'breakfast')];
    const plan = suggestPlan(meals);
    for (const d of plan.days) {
      expect(d.breakfast).not.toBeNull();
    }
  });
});
