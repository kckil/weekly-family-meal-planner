import { useMemo } from 'react';
import type { Meal, WeeklyPlan } from '../types';
import { MealSidebar } from './MealSidebar';
import { WeekGrid } from './WeekGrid';
import { Button, SectionHeading, TypeDot, Icons } from './ui';
import { weekRangeLabel } from '../utils/dates';

interface DragState {
  id: string;
  type: string;
}

interface PlanViewProps {
  plan: WeeklyPlan;
  meals: Meal[];
  dragState: DragState | null;
  setDragState: (s: DragState | null) => void;
  filter: string;
  setFilter: (f: string) => void;
  onDropMeal: (day: string, row: string, mealId: string) => void;
  onClear: (day: string, row: string) => void;
  onSwap: (fromDay: string, fromRow: string, toDay: string, toRow: string) => void;
  onRegenerate: () => void;
  onFinalize: () => void;
  onClearAll: () => void;
  onOpenLibrary: () => void;
}

export function PlanView({ plan, meals, dragState, setDragState, filter, setFilter, onDropMeal, onClear, onSwap, onRegenerate, onFinalize, onClearAll, onOpenLibrary }: PlanViewProps) {
  const planStats = useMemo(() => {
    const uniqueDinners = new Set(plan.days.map(d => d.dinner).filter(Boolean)).size;
    const filledSlots = plan.days.reduce((n, d) => n + (d.breakfast ? 1 : 0) + (d.dinner ? 1 : 0) + (d.lunch ? 1 : 0), 0);
    return { uniqueDinners, filledSlots };
  }, [plan]);

  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
      <MealSidebar meals={meals} onGenerate={onRegenerate}
        dragState={dragState} setDragState={setDragState}
        filter={filter} setFilter={setFilter}
        onOpenLibrary={onOpenLibrary}/>

      <div style={{ flex: 1, minWidth: 0 }}>
        <SectionHeading
          eyebrow={plan.finalized ? 'Finalized plan' : 'Week in progress'}
          title={`Week of ${weekRangeLabel(plan.createdAt).split(' – ')[0]}`}
          right={
            <>
              <Button variant="ghost" size="sm" icon={Icons.X} onClick={onClearAll}>Clear All</Button>
              <Button variant="outline" size="sm" icon={Icons.Sparkle} onClick={onRegenerate}>Surprise Me!</Button>
              <Button variant="primary" size="sm" icon={Icons.Check} onClick={onFinalize} disabled={plan.finalized}>
                {plan.finalized ? 'Finalized' : 'Finalize plan'}
              </Button>
            </>
          }>
          <span className="mono">{planStats.uniqueDinners}</span> unique dinners · <span className="mono">{planStats.filledSlots}</span> slots filled · drag meals from the left to swap
        </SectionHeading>

        <WeekGrid plan={plan} meals={meals} onDropMeal={onDropMeal} onClear={onClear} onSwap={onSwap} dragState={dragState} setDragState={setDragState}/>

        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: 'var(--paper-2)', border: '1px solid var(--line)', borderRadius: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><TypeDot type="breakfast"/> <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>Breakfast</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><TypeDot type="dinner"/> <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>Dinner</span></div>
          <div style={{ width: 1, height: 14, background: 'var(--line)' }}/>
          <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>↺ Leftover — auto-filled from the previous night's dinner; drop a meal here to override.</span>
        </div>
      </div>
    </div>
  );
}
