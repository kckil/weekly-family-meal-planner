export type MealType = 'breakfast' | 'dinner';

export interface Meal {
  id: string;
  name: string;
  type: MealType;
  ingredients: string[];
  timesUsed: number;
  lastUsed: string | null;
}

export interface DayPlan {
  day: string;
  breakfast: string | null;
  lunch: string | null;
  lunchIsLeftover: boolean;
  dinner: string | null;
}

export interface WeeklyPlan {
  id: string;
  createdAt: string;
  days: DayPlan[];
  finalized: boolean;
}
