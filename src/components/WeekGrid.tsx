import { useState, type DragEvent } from 'react';
import type { Meal, WeeklyPlan } from '../types';
import { DAYS, DAYS_LONG } from '../utils/data';
import { TypeDot, Icons } from './ui';

interface DragState {
  id: string;
  type: string;
}

interface WeekGridProps {
  plan: WeeklyPlan;
  meals: Meal[];
  onDropMeal: (day: string, row: string, mealId: string) => void;
  onClear: (day: string, row: string) => void;
  onSwap: (fromDay: string, fromRow: string, toDay: string, toRow: string) => void;
  dragState: DragState | null;
  setDragState: (s: DragState | null) => void;
}

export function WeekGrid({ plan, meals, onDropMeal, onClear, onSwap, dragState, setDragState }: WeekGridProps) {
  const cols = '140px repeat(6, minmax(0, 1fr))';
  const rows = ['breakfast', 'lunch', 'dinner'];
  return (
    <div style={{
      background: 'var(--paper)', border: '1px solid var(--line)',
      borderRadius: 14, padding: 18, boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 10, marginBottom: 10 }}>
        <div/>
        {DAYS.map(d => (
          <div key={d} style={{ display: 'flex', alignItems: 'baseline', gap: 8, paddingLeft: 4 }}>
            <div className="serif" style={{ fontSize: 22 }}>{d}</div>
            <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)', letterSpacing: '0.05em' }}>
              {DAYS_LONG[d].slice(3).toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      {rows.map((row, ri) => (
        <div key={row} style={{ display: 'grid', gridTemplateColumns: cols, gap: 10, marginBottom: ri < rows.length - 1 ? 10 : 0, alignItems: 'stretch' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px', background: 'var(--paper-2)', border: '1px solid var(--line)',
            borderRadius: 10,
          }}>
            <span style={{ color: 'var(--ink-3)', display: 'flex' }}>
              {row === 'breakfast' ? Icons.Sun : row === 'lunch' ? Icons.Clock : Icons.Moon}
            </span>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-2)', textTransform: 'capitalize' }}>{row}</span>
          </div>
          {DAYS.map(d => (
            <Slot key={d + row} day={d} row={row} plan={plan} meals={meals}
              onDropMeal={onDropMeal} onClear={onClear} onSwap={onSwap}
              dragState={dragState} setDragState={setDragState}/>
          ))}
        </div>
      ))}
    </div>
  );
}

function Slot({ day, row, plan, meals, onDropMeal, onClear, onSwap, dragState, setDragState }: {
  day: string; row: string; plan: WeeklyPlan; meals: Meal[];
  onDropMeal: (day: string, row: string, mealId: string) => void;
  onClear: (day: string, row: string) => void;
  onSwap: (fromDay: string, fromRow: string, toDay: string, toRow: string) => void;
  dragState: DragState | null;
  setDragState: (s: DragState | null) => void;
}) {
  const dayPlan = plan.days.find(d => d.day === day);
  const [over, setOver] = useState(false);

  const isLeftover = row === 'lunch' && !!dayPlan?.lunchIsLeftover && !!dayPlan?.lunch;
  const mealId = isLeftover ? dayPlan!.lunch : dayPlan?.[row as keyof typeof dayPlan] as string | null;
  const meal = mealId ? meals.find(m => m.id === mealId) : null;
  const acceptsType = row === 'breakfast' ? 'breakfast' : row === 'dinner' ? 'dinner' : null;

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    setOver(true);
  };
  const onDragLeave = () => setOver(false);
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    const source = e.dataTransfer.getData('text/slot-source');
    if (source) {
      const [fromDay, fromRow] = source.split(':');
      if (fromDay === day && fromRow === row) return;
      onSwap(fromDay, fromRow, day, row);
      return;
    }
    const id = e.dataTransfer.getData('text/meal-id');
    if (!id) return;
    const m = meals.find(mm => mm.id === id);
    if (!m) return;
    if (acceptsType && m.type !== acceptsType) return;
    onDropMeal(day, row, id);
  };

  const onSlotDragStart = (e: DragEvent) => {
    if (!mealId || !meal) return;
    e.dataTransfer.setData('text/meal-id', mealId);
    e.dataTransfer.setData('text/slot-source', `${day}:${row}`);
    setDragState({ id: mealId, type: meal.type });
  };
  const onSlotDragEnd = () => setDragState(null);

  const height = 88;

  const highlightDrop = over && (!acceptsType || dragState?.type === acceptsType) || (over && row === 'lunch');

  if (!meal) {
    return (
      <div onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
        style={{
          height, borderRadius: 10,
          background: highlightDrop ? 'var(--sage-3)' : 'var(--paper-2)',
          border: `1px dashed ${highlightDrop ? 'var(--sage-ink)' : 'var(--line-2)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: highlightDrop ? 'var(--sage-ink)' : 'var(--ink-3)',
          fontSize: 12, fontStyle: 'italic', transition: 'background .15s, border-color .15s',
        }}>
        <span style={{ padding: '0 10px' }}>{highlightDrop ? 'Drop to assign' : 'empty — drag a meal here'}</span>
      </div>
    );
  }

  return (
    <div onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
      style={{ position: 'relative', height, borderRadius: 10, outline: highlightDrop ? '2px solid var(--sage-ink)' : 'none', outlineOffset: 2 }}>
      <SlotCard meal={meal} isLeftover={isLeftover} onClear={() => onClear(day, row)}
        onDragStart={onSlotDragStart} onDragEnd={onSlotDragEnd}/>
    </div>
  );
}

function SlotCard({ meal, isLeftover, onClear, onDragStart, onDragEnd }: {
  meal: Meal; isLeftover: boolean; onClear: () => void;
  onDragStart: (e: DragEvent) => void; onDragEnd: () => void;
}) {
  const [hover, setHover] = useState(false);
  const canDrag = !isLeftover;
  return (
    <div draggable={canDrag} onDragStart={onDragStart} onDragEnd={onDragEnd}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '8px 10px',
        background: isLeftover ? 'var(--paper-2)' : 'var(--paper)',
        border: `1px solid ${isLeftover ? 'var(--line)' : 'var(--line-2)'}`,
        borderRadius: 10, boxShadow: hover ? 'var(--shadow-sm)' : 'none',
        cursor: canDrag ? 'grab' : 'default',
        position: 'relative',
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <TypeDot type={meal.type} size={6}/>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', flex: 1, lineHeight: 1.3 }}>{meal.name}</div>
      </div>
      <div style={{ fontSize: 10.5, color: 'var(--ink-3)', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {isLeftover ? '↺ leftovers' : meal.ingredients.slice(0, 3).join(' · ')}
      </div>
      {hover && !isLeftover && (
        <button onClick={onClear} title="Clear slot"
          style={{
            position: 'absolute', top: 4, right: 4, padding: 3, borderRadius: 6,
            background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--ink-3)',
            display: 'flex',
          }}>{Icons.X}</button>
      )}
    </div>
  );
}
