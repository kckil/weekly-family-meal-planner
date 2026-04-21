import { useState, useEffect, useRef } from 'react';
import type { Meal, WeeklyPlan } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { buildInitialMeals } from '../utils/data';
import { suggestPlan } from '../utils/suggestions';
import { PlanView } from './PlanView';
import { ShoppingListView } from './ShoppingList';
import { MealLibrary } from './MealLibrary';
import { HistoryView } from './History';
import { ImportExportModal } from './ImportExport';
import { Button, Toast, Icons } from './ui';

const TABS = [
  { id: 'plan', label: 'This week', icon: Icons.Calendar },
  { id: 'shop', label: 'Shopping', icon: Icons.List },
  { id: 'library', label: 'Library', icon: Icons.Book },
  { id: 'history', label: 'History', icon: Icons.History },
];

export function App() {
  const [meals, setMeals] = useLocalStorage<Meal[] | null>('mp.meals.v1', null);
  const [plan, setPlan] = useLocalStorage<WeeklyPlan | null>('mp.plan.v1', null);
  const [history, setHistory] = useLocalStorage<WeeklyPlan[]>('mp.history.v1', []);
  const [tab, setTab] = useLocalStorage('mp.tab.v1', 'plan');
  const [grouping, setGrouping] = useLocalStorage('mp.grouping.v1', 'category');

  const [dragState, setDragState] = useState<{ id: string; type: string } | null>(null);
  const [filter, setFilter] = useState('all');
  const [toast, setToastMsg] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [impExpOpen, setImpExpOpen] = useState(false);

  // Seed initial meals
  useEffect(() => {
    if (meals === null) {
      setMeals(buildInitialMeals());
    }
  }, []);

  // Auto-generate plan if none exists
  useEffect(() => {
    if (!plan && meals && meals.length > 0) {
      setPlan(suggestPlan(meals));
    }
  }, [plan, meals]);

  const onToast = (msg: string) => {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2200);
  };

  // Plan mutations
  const handleDropMeal = (day: string, row: string, mealId: string) => {
    setPlan(prev => {
      if (!prev || !meals) return prev;
      const next = { ...prev, days: prev.days.map(d => ({ ...d })) };
      const idx = next.days.findIndex(d => d.day === day);
      if (idx < 0) return prev;
      const m = meals.find(mm => mm.id === mealId);
      if (!m) return prev;
      if (row === 'lunch') {
        next.days[idx].lunch = mealId;
        next.days[idx].lunchIsLeftover = false;
      } else if (row === 'breakfast' && m.type === 'breakfast') {
        next.days[idx].breakfast = mealId;
      } else if (row === 'dinner' && m.type === 'dinner') {
        next.days[idx].dinner = mealId;
        const nextIdx = idx + 1;
        if (nextIdx < next.days.length && next.days[nextIdx].lunchIsLeftover) {
          next.days[nextIdx].lunch = mealId;
        }
      }
      return next;
    });
  };

  const handleClear = (day: string, row: string) => {
    setPlan(prev => {
      if (!prev) return prev;
      const next = { ...prev, days: prev.days.map(d => ({ ...d })) };
      const idx = next.days.findIndex(d => d.day === day);
      if (idx < 0) return prev;
      if (row === 'lunch') {
        next.days[idx].lunch = null;
        next.days[idx].lunchIsLeftover = false;
      } else {
        (next.days[idx] as Record<string, unknown>)[row] = null;
        if (row === 'dinner') {
          const nextIdx = idx + 1;
          if (nextIdx < next.days.length && next.days[nextIdx].lunchIsLeftover) {
            next.days[nextIdx].lunch = null;
          }
        }
      }
      return next;
    });
  };

  const regenerate = () => {
    if (!meals) return;
    setPlan(suggestPlan(meals));
    onToast('New week randomized!');
  };

  const finalize = () => {
    if (!plan || !meals) return;
    const usedIds = new Set<string>();
    for (const d of plan.days) {
      if (d.breakfast) usedIds.add(d.breakfast);
      if (d.dinner) usedIds.add(d.dinner);
      if (d.lunch && !d.lunchIsLeftover) usedIds.add(d.lunch);
    }
    const nowIso = new Date().toISOString();
    setMeals(prev => prev!.map(m => usedIds.has(m.id) ? { ...m, timesUsed: m.timesUsed + 1, lastUsed: nowIso } : m));
    const finalized = { ...plan, finalized: true, createdAt: nowIso };
    setHistory(prev => [finalized, ...prev]);
    setPlan(finalized);
    onToast('Plan finalized — shopping list is ready');
    setTab('shop');
  };

  if (!meals) return null;

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: 'oklch(0.985 0.008 85 / 0.85)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--line)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '14px 28px', maxWidth: 1600, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 9,
              background: 'var(--sage-ink)', color: 'var(--paper)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 18, lineHeight: 1 }}>m</span>
            </div>
            <div>
              <div className="serif" style={{ fontSize: 18, lineHeight: 1 }}>Mise</div>
              <div className="mono" style={{ fontSize: 9.5, color: 'var(--ink-3)', letterSpacing: '0.1em', marginTop: 2 }}>MEAL PLANNER</div>
            </div>
          </div>

          <nav style={{ display: 'flex', gap: 2, marginLeft: 12 }}>
            {TABS.map(t => {
              const active = t.id === tab;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '7px 12px', borderRadius: 8,
                    fontSize: 13, fontWeight: 500,
                    color: active ? 'var(--ink)' : 'var(--ink-3)',
                    background: active ? 'var(--paper-2)' : 'transparent',
                    border: active ? '1px solid var(--line)' : '1px solid transparent',
                  }}>
                  {t.icon}{t.label}
                </button>
              );
            })}
          </nav>

          <div style={{ flex: 1 }}/>
          <Button variant="ghost" size="sm" icon={Icons.Upload} onClick={() => setImpExpOpen(true)}>Import / Export</Button>
        </div>
      </header>

      <main style={{ padding: tab === 'plan' ? '20px 20px 40px' : '30px 40px 60px', maxWidth: 1600, margin: '0 auto' }}>
        {tab === 'plan' && plan && (
          <PlanView
            plan={plan} meals={meals}
            dragState={dragState} setDragState={setDragState}
            filter={filter} setFilter={setFilter}
            onDropMeal={handleDropMeal} onClear={handleClear}
            onRegenerate={regenerate} onFinalize={finalize}
            onOpenLibrary={() => setTab('library')}/>
        )}
        {tab === 'shop' && (
          <ShoppingListView plan={plan} meals={meals} onToast={onToast}
            grouping={grouping} setGrouping={setGrouping}/>
        )}
        {tab === 'library' && (
          <MealLibrary meals={meals} setMeals={setMeals as React.Dispatch<React.SetStateAction<Meal[]>>} onToast={onToast}/>
        )}
        {tab === 'history' && (
          <HistoryView history={history} meals={meals}/>
        )}
      </main>

      <ImportExportModal
        open={impExpOpen} onClose={() => setImpExpOpen(false)}
        meals={meals} setMeals={setMeals as React.Dispatch<React.SetStateAction<Meal[]>>}
        history={history} setHistory={setHistory}
        onToast={onToast}/>

      <Toast toast={toast}/>
    </>
  );
}
