import { useState, useMemo } from 'react';
import type { Meal } from '../types';
import { MealCard } from './MealCard';
import { Button, TextInput, Segmented, Icons } from './ui';

interface DragState {
  id: string;
  type: string;
}

interface MealSidebarProps {
  meals: Meal[];
  onGenerate: () => void;
  dragState: DragState | null;
  setDragState: (s: DragState | null) => void;
  filter: string;
  setFilter: (f: string) => void;
  onOpenLibrary: () => void;
}

export function MealSidebar({ meals, onGenerate, dragState, setDragState, filter, setFilter, onOpenLibrary }: MealSidebarProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    let ms = [...meals];
    if (filter !== 'all') ms = ms.filter(m => m.type === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      ms = ms.filter(m => m.name.toLowerCase().includes(q) || m.ingredients.join(' ').toLowerCase().includes(q));
    }
    return ms.sort((a, b) => {
      const la = a.lastUsed ? Date.parse(a.lastUsed) : -Infinity;
      const lb = b.lastUsed ? Date.parse(b.lastUsed) : -Infinity;
      if (la !== lb) return la - lb;
      return a.timesUsed - b.timesUsed;
    });
  }, [meals, filter, query]);

  return (
    <aside style={{
      width: 300, flexShrink: 0, position: 'sticky', top: 20, alignSelf: 'flex-start',
      background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 14,
      display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 40px)',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ padding: 14, borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Your meals</div>
          <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{meals.length}</span>
        </div>
        <TextInput value={query} onChange={setQuery} placeholder="Search meals…" icon={Icons.Search} style={{ marginBottom: 10 }}/>
        <Segmented value={filter} onChange={setFilter}
          options={[
            { value: 'all', label: 'All' },
            { value: 'breakfast', label: 'Breakfast' },
            { value: 'dinner', label: 'Dinner' },
          ]}/>
      </div>

      <div className="scroll" style={{ overflow: 'auto', flex: 1, padding: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {filtered.length === 0 && (
          <div style={{ padding: 16, textAlign: 'center', color: 'var(--ink-3)', fontSize: 12.5 }}>
            No meals match.
          </div>
        )}
        {filtered.map(m => (
          <MealCard key={m.id} meal={m}
            draggable dragHandle compact
            onDragStart={(e) => {
              e.dataTransfer.setData('text/meal-id', m.id);
              e.dataTransfer.effectAllowed = 'copy';
              setDragState({ id: m.id, type: m.type });
            }}
            onDragEnd={() => setDragState(null)}
            ghost={dragState?.id === m.id}
            style={{ cursor: 'grab' }}/>
        ))}
      </div>

      <div style={{ padding: 12, borderTop: '1px solid var(--line)', display: 'flex', gap: 8 }}>
        <Button variant="outline" size="sm" icon={Icons.Book} onClick={onOpenLibrary} style={{ flex: 1, justifyContent: 'center' }}>Library</Button>
        <Button variant="primary" size="sm" icon={Icons.Sparkle} onClick={onGenerate} style={{ flex: 1, justifyContent: 'center' }}>Surprise Me!</Button>
      </div>
    </aside>
  );
}
