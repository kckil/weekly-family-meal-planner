import type { Meal, WeeklyPlan } from '../types';
import { DAYS } from './data';
import { uid } from './uid';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function suggestPlan(meals: Meal[]): WeeklyPlan {
  const dinners = shuffle(meals.filter(m => m.type === 'dinner'));
  const breakfasts = shuffle(meals.filter(m => m.type === 'breakfast'));

  const dinnerPicks = dinners.slice(0, 6);
  while (dinnerPicks.length < 6 && dinners.length > 0) {
    dinnerPicks.push(dinners[dinnerPicks.length % dinners.length]);
  }

  const bPicks = breakfasts.slice(0, 6);
  while (bPicks.length < 6 && breakfasts.length > 0) {
    bPicks.push(breakfasts[bPicks.length % breakfasts.length]);
  }

  const days = DAYS.map((d, i) => {
    const dinner = dinnerPicks[i]?.id ?? null;
    const prevDinner = i === 0 ? null : (dinnerPicks[i - 1]?.id ?? null);
    return {
      day: d,
      breakfast: bPicks[i]?.id ?? null,
      lunch: i === 0 ? null : prevDinner,
      lunchIsLeftover: i > 0,
      dinner,
    };
  });

  return {
    id: uid(),
    createdAt: new Date().toISOString(),
    days,
    finalized: false,
  };
}
