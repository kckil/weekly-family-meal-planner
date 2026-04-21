import { useState, useMemo } from 'react';
import type { Meal, WeeklyPlan } from '../types';
import { DAYS, DAYS_LONG } from '../utils/data';
import { buildShoppingList } from '../utils/shoppingList';
import { weekRangeLabel } from '../utils/dates';
import { Button, Segmented, SectionHeading, Tag, Icons } from './ui';

interface ShoppingListViewProps {
  plan: WeeklyPlan | null;
  meals: Meal[];
  onToast: (msg: string) => void;
  grouping: string;
  setGrouping: (g: string) => void;
}

export function ShoppingListView({ plan, meals, onToast, grouping, setGrouping }: ShoppingListViewProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const items = useMemo(() => buildShoppingList(plan, meals), [plan, meals]);

  const groups = useMemo(() => {
    if (grouping === 'flat') return [{ name: null as string | null, items }];
    if (grouping === 'meal') {
      const byMeal = new Map<string, typeof items>();
      for (const it of items) {
        for (const m of it.meals) {
          if (!byMeal.has(m)) byMeal.set(m, []);
          byMeal.get(m)!.push(it);
        }
      }
      return [...byMeal.entries()].sort((a, b) => a[0].localeCompare(b[0]))
        .map(([name, items]) => ({ name, items }));
    }
    const order = ['Produce', 'Protein', 'Dairy', 'Grains & bread', 'Pantry', 'Other'];
    const byCat = new Map<string, typeof items>();
    for (const it of items) {
      if (!byCat.has(it.category)) byCat.set(it.category, []);
      byCat.get(it.category)!.push(it);
    }
    return order.filter(o => byCat.has(o)).map(o => ({ name: o, items: byCat.get(o)! }));
  }, [items, grouping]);

  const toggle = (name: string) => {
    setChecked(prev => {
      const s = new Set(prev);
      s.has(name) ? s.delete(name) : s.add(name);
      return s;
    });
  };

  const planText = useMemo(() => {
    if (!plan) return '';
    const byId = new Map(meals.map(m => [m.id, m]));
    return DAYS.map(day => {
      const d = plan.days.find(p => p.day === day);
      if (!d) return '';
      const lines: string[] = [];
      if (d.breakfast) {
        const m = byId.get(d.breakfast);
        if (m) lines.push(m.name);
      }
      if (d.lunch) {
        const m = byId.get(d.lunch);
        if (m) lines.push(d.lunchIsLeftover ? m.name : `${m.name} (${m.ingredients.slice(0, 2).join(', ')})`);
      }
      if (d.dinner) {
        const m = byId.get(d.dinner);
        if (m) lines.push(`${m.name} (${m.ingredients.slice(0, 2).join(', ')})`);
      }
      return `== ${DAYS_LONG[day]} ==\n${lines.join('\n')}`;
    }).join('\n\n');
  }, [plan, meals]);

  const shoppingText = useMemo(() => {
    if (grouping === 'flat') return items.map(i => `- ${i.name}`).join('\n');
    return groups.map(g => `${g.name ? g.name + '\n' : ''}${g.items.map(i => `- ${i.name}`).join('\n')}`).join('\n\n');
  }, [groups, items, grouping]);

  const fullText = useMemo(() => {
    const parts = [];
    if (planText) parts.push(planText);
    if (shoppingText) parts.push('== Shopping List ==\n' + shoppingText);
    return parts.join('\n\n');
  }, [planText, shoppingText]);

  const copy = async () => {
    await navigator.clipboard.writeText(fullText);
    onToast('Plan & shopping list copied');
  };

  const download = () => {
    const blob = new Blob([fullText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'shopping-list.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: 960 }}>
      <SectionHeading
        eyebrow="This week"
        title="Shopping list"
        right={
          <>
            <Segmented value={grouping} onChange={setGrouping}
              options={[
                { value: 'category', label: 'By category' },
                { value: 'meal', label: 'By meal' },
                { value: 'flat', label: 'Flat list' },
              ]}/>
            <Button variant="outline" size="sm" icon={Icons.Download} onClick={download}>Download .txt</Button>
            <Button variant="primary" size="sm" icon={Icons.Copy} onClick={copy}>Copy</Button>
          </>
        }>
        {plan ? weekRangeLabel(plan.createdAt) : ''} · <span className="mono">{items.length}</span> ingredients across <span className="mono">{new Set(items.flatMap(i => i.meals)).size}</span> meals
      </SectionHeading>

      {items.length === 0 && (
        <div style={{ padding: 40, border: '1px dashed var(--line-2)', borderRadius: 14, textAlign: 'center', color: 'var(--ink-3)' }}>
          No meals planned yet. Generate or build a week to see a shopping list.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
        {groups.map(g => (
          <div key={g.name || 'all'} style={{
            background: 'var(--paper)', border: '1px solid var(--line)',
            borderRadius: 14, padding: 18, boxShadow: 'var(--shadow-sm)',
          }}>
            {g.name && (
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid var(--line)' }}>
                <div className="serif" style={{ fontSize: 22 }}>{g.name}</div>
                <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{g.items.length}</span>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {g.items.map(it => {
                const isChecked = checked.has(it.name);
                return (
                  <label key={it.name + (g.name || '')} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '8px 6px',
                    borderRadius: 8, cursor: 'pointer',
                    color: isChecked ? 'var(--ink-3)' : 'var(--ink)',
                  }}>
                    <input type="checkbox" checked={isChecked} onChange={() => toggle(it.name)}
                      style={{ accentColor: 'var(--sage-ink)', cursor: 'pointer', width: 15, height: 15 }}/>
                    <span style={{ flex: 1, fontSize: 13.5, textDecoration: isChecked ? 'line-through' : 'none' }}>{it.name}</span>
                    {it.count > 1 && <Tag tone="neutral" style={{ fontSize: 10.5 }}>×{it.count}</Tag>}
                    <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={it.meals.join(', ')}>
                      {it.meals[0]}{it.meals.length > 1 ? ` +${it.meals.length - 1}` : ''}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
