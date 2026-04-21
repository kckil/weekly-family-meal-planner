import { useState, useEffect, useMemo } from 'react';
import type { Meal } from '../types';
import { uid } from '../utils/uid';
import { relDate } from '../utils/dates';
import { Button, Tag, TextInput, Segmented, SectionHeading, TypeDot, Modal, Icons } from './ui';

interface MealLibraryProps {
  meals: Meal[];
  setMeals: React.Dispatch<React.SetStateAction<Meal[]>>;
  onToast: (msg: string) => void;
}

export function MealLibrary({ meals, setMeals, onToast }: MealLibraryProps) {
  const [editing, setEditing] = useState<Meal | { name: string; type: string; ingredients: string[] } | null>(null);
  const [sort, setSort] = useState('name');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    let ms = [...meals];
    if (query.trim()) {
      const q = query.toLowerCase();
      ms = ms.filter(m => m.name.toLowerCase().includes(q) || m.ingredients.join(' ').toLowerCase().includes(q));
    }
    if (sort === 'name') ms.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'type') ms.sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name));
    else if (sort === 'times') ms.sort((a, b) => b.timesUsed - a.timesUsed);
    else if (sort === 'recent') ms.sort((a, b) => (Date.parse(b.lastUsed || '0') || 0) - (Date.parse(a.lastUsed || '0') || 0));
    return ms;
  }, [meals, sort, query]);

  const del = (id: string) => {
    setMeals(prev => prev.filter(m => m.id !== id));
    onToast('Meal deleted');
  };

  const save = (draft: { id?: string; name: string; type: string; ingredients: string[] }) => {
    if (draft.id) {
      setMeals(prev => prev.map(m => m.id === draft.id ? { ...m, name: draft.name, type: draft.type as Meal['type'], ingredients: draft.ingredients } : m));
      onToast('Meal updated');
    } else {
      setMeals(prev => [...prev, { id: uid(), name: draft.name, type: draft.type as Meal['type'], ingredients: draft.ingredients, timesUsed: 0, lastUsed: null }]);
      onToast('Meal added');
    }
    setEditing(null);
  };

  return (
    <div>
      <SectionHeading
        eyebrow="Meals"
        title="Library"
        right={
          <>
            <TextInput value={query} onChange={setQuery} placeholder="Search…" icon={Icons.Search} style={{ width: 220 }}/>
            <Segmented value={sort} onChange={setSort}
              options={[
                { value: 'name', label: 'Name' },
                { value: 'type', label: 'Type' },
                { value: 'recent', label: 'Recent' },
                { value: 'times', label: 'Uses' },
              ]}/>
            <Button variant="primary" size="sm" icon={Icons.Plus} onClick={() => setEditing({ name: '', type: 'dinner', ingredients: [] })}>Add meal</Button>
          </>
        }>
        {meals.length} meals · {meals.filter(m => m.type === 'dinner').length} dinners · {meals.filter(m => m.type === 'breakfast').length} breakfasts
      </SectionHeading>

      <div style={{
        background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 14,
        overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1.5fr 0.6fr 2.5fr 0.7fr 0.7fr 60px',
          padding: '12px 18px', background: 'var(--paper-2)', borderBottom: '1px solid var(--line)',
          fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase', gap: 14,
        }}>
          <div>Meal</div><div>Type</div><div>Ingredients</div><div>Used</div><div>Last</div><div/>
        </div>
        {filtered.map((m, idx) => (
          <div key={m.id} style={{
            display: 'grid', gridTemplateColumns: '1.5fr 0.6fr 2.5fr 0.7fr 0.7fr 60px',
            padding: '12px 18px', alignItems: 'center', gap: 14,
            borderBottom: idx < filtered.length - 1 ? '1px solid var(--line)' : 'none',
            fontSize: 13.5,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500 }}>
              <TypeDot type={m.type}/>{m.name}
            </div>
            <div><Tag tone={m.type === 'dinner' ? 'sage' : 'butter'}>{m.type}</Tag></div>
            <div style={{ color: 'var(--ink-2)', fontSize: 12.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {m.ingredients.join(' · ')}
            </div>
            <div className="mono" style={{ fontSize: 12, color: 'var(--ink-2)' }}>{m.timesUsed}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{relDate(m.lastUsed)}</div>
            <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
              <button onClick={() => setEditing(m)} title="Edit"
                style={{ padding: 6, borderRadius: 7, color: 'var(--ink-3)' }}>{Icons.Edit}</button>
              <button onClick={() => del(m.id)} title="Delete"
                style={{ padding: 6, borderRadius: 7, color: 'var(--ink-3)' }}>{Icons.Trash}</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)' }}>No meals match.</div>
        )}
      </div>

      <MealEditor meal={editing} onClose={() => setEditing(null)} onSave={save}/>
    </div>
  );
}

function MealEditor({ meal, onClose, onSave }: {
  meal: { id?: string; name: string; type: string; ingredients: string[] } | null;
  onClose: () => void;
  onSave: (draft: { id?: string; name: string; type: string; ingredients: string[] }) => void;
}) {
  const [draft, setDraft] = useState<{ id?: string; name: string; type: string; ingredientsText: string } | null>(null);

  useEffect(() => {
    if (!meal) { setDraft(null); return; }
    setDraft({
      id: 'id' in meal ? (meal as Meal).id : undefined,
      name: meal.name || '',
      type: meal.type || 'dinner',
      ingredientsText: (meal.ingredients || []).join(', '),
    });
  }, [meal]);

  if (!draft) return null;

  const save = () => {
    const ingredients = draft.ingredientsText.split(/[,;]/).map(s => s.trim()).filter(Boolean);
    if (!draft.name.trim()) return;
    onSave({ id: draft.id, name: draft.name.trim(), type: draft.type, ingredients });
  };

  return (
    <Modal open onClose={onClose} title={draft.id ? 'Edit meal' : 'Add meal'}
      footer={<>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={save} disabled={!draft.name.trim()}>Save</Button>
      </>}>
      <Field label="Name">
        <TextInput value={draft.name} onChange={v => setDraft({ ...draft, name: v })} placeholder="e.g. Chicken Stir Fry"/>
      </Field>
      <Field label="Type">
        <Segmented value={draft.type} onChange={v => setDraft({ ...draft, type: v })}
          options={[
            { value: 'breakfast', label: 'Breakfast' },
            { value: 'dinner', label: 'Dinner' },
          ]}/>
      </Field>
      <Field label="Ingredients" hint="Separated by commas or semicolons. No pantry staples.">
        <textarea value={draft.ingredientsText} onChange={e => setDraft({ ...draft, ingredientsText: e.target.value })}
          placeholder="chicken thighs, bell peppers, soy sauce"
          style={{
            width: '100%', minHeight: 90, resize: 'vertical',
            padding: '10px 12px', borderRadius: 10, border: '1px solid var(--line-2)',
            background: 'var(--paper)', outline: 'none', fontSize: 13.5, lineHeight: 1.5,
          }}/>
      </Field>
    </Modal>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 6, letterSpacing: '0.01em' }}>{label}</div>
      {children}
      {hint && <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 6 }}>{hint}</div>}
    </div>
  );
}
