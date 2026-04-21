import { useState, useRef } from 'react';
import type { Meal, WeeklyPlan } from '../types';
import { parseCSV, toCSV } from '../utils/csv';
import { uid } from '../utils/uid';
import { Button, Modal, Tag, Icons } from './ui';

interface ImportExportProps {
  open: boolean;
  onClose: () => void;
  meals: Meal[];
  setMeals: React.Dispatch<React.SetStateAction<Meal[]>>;
  history: WeeklyPlan[];
  setHistory: React.Dispatch<React.SetStateAction<WeeklyPlan[]>>;
  onToast: (msg: string) => void;
}

export function ImportExportModal({ open, onClose, meals, setMeals, history, setHistory, onToast }: ImportExportProps) {
  const fileInputCsv = useRef<HTMLInputElement>(null);
  const fileInputJson = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<{ kind: 'csv'; data: ReturnType<typeof parseCSV>; name: string } | { kind: 'json'; data: { meals?: Meal[]; history?: WeeklyPlan[] }; name: string } | null>(null);

  const csvExample = `Chicken Stir Fry, dinner, chicken thighs; bell peppers; broccoli; soy sauce\nOatmeal with Berries, breakfast, blueberries; strawberries\nTacos, dinner, ground beef; tortillas; avocado; cilantro`;

  const exportJson = () => {
    const data = { meals, history, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `meal-planner-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onToast('Exported JSON');
  };

  const exportCsv = () => {
    const blob = new Blob([toCSV(meals)], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'meals.csv';
    a.click();
    URL.revokeObjectURL(url);
    onToast('Exported CSV');
  };

  const handleCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const parsed = parseCSV(String(r.result));
      setPreview({ kind: 'csv', data: parsed, name: f.name });
    };
    r.readAsText(f);
    e.target.value = '';
  };

  const handleJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const data = JSON.parse(String(r.result));
        setPreview({ kind: 'json', data, name: f.name });
      } catch {
        onToast('Invalid JSON file');
      }
    };
    r.readAsText(f);
    e.target.value = '';
  };

  const applyPreview = () => {
    if (!preview) return;
    if (preview.kind === 'csv') {
      const newMeals = preview.data.map(d => ({ id: uid(), name: d.name, type: d.type, ingredients: d.ingredients, timesUsed: 0, lastUsed: null }));
      setMeals(prev => {
        const byName = new Map(prev.map(m => [m.name.toLowerCase(), m]));
        for (const nm of newMeals) {
          const existing = byName.get(nm.name.toLowerCase());
          if (existing) byName.set(nm.name.toLowerCase(), { ...existing, type: nm.type, ingredients: nm.ingredients });
          else byName.set(nm.name.toLowerCase(), nm);
        }
        return [...byName.values()];
      });
      onToast(`Imported ${newMeals.length} meals`);
    } else if (preview.kind === 'json') {
      if (Array.isArray(preview.data.meals)) setMeals(preview.data.meals);
      if (Array.isArray(preview.data.history)) setHistory(preview.data.history);
      onToast('Restored from JSON');
    }
    setPreview(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Import & Export" width={640}
      footer={preview ? (
        <>
          <Button variant="outline" onClick={() => setPreview(null)}>Cancel</Button>
          <Button variant="primary" onClick={applyPreview}>
            {preview.kind === 'csv' ? `Import ${preview.data.length} meals` : 'Restore from JSON'}
          </Button>
        </>
      ) : (
        <Button variant="outline" onClick={onClose}>Close</Button>
      )}>

      {!preview && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
            <ActionCard icon={Icons.Upload} title="Import CSV" subtitle="Add meals from a CSV file" onClick={() => fileInputCsv.current?.click()}/>
            <ActionCard icon={Icons.Upload} title="Restore from JSON" subtitle="Load a full backup" onClick={() => fileInputJson.current?.click()}/>
            <ActionCard icon={Icons.Download} title="Export CSV" subtitle="Just meals + ingredients" onClick={exportCsv}/>
            <ActionCard icon={Icons.Download} title="Export JSON" subtitle="Full state (meals + history)" onClick={exportJson}/>
          </div>

          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 6, letterSpacing: '0.01em' }}>CSV format</div>
          <pre className="mono" style={{
            background: 'var(--paper-2)', border: '1px solid var(--line)', borderRadius: 10,
            padding: 12, fontSize: 11.5, overflow: 'auto', lineHeight: 1.6, margin: 0, color: 'var(--ink-2)',
          }}>{csvExample}</pre>
          <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 8 }}>
            Three columns: <b>name</b>, <b>type</b> (breakfast/dinner), <b>ingredients</b> (semicolon-separated). Matching names overwrite.
          </div>

          <input ref={fileInputCsv} type="file" accept=".csv,text/csv" onChange={handleCsv} style={{ display: 'none' }}/>
          <input ref={fileInputJson} type="file" accept=".json,application/json" onChange={handleJson} style={{ display: 'none' }}/>
        </>
      )}

      {preview?.kind === 'csv' && (
        <>
          <div style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 12 }}>
            Preview of <b>{preview.name}</b> — <span className="mono">{preview.data.length}</span> meals parsed.
          </div>
          <div style={{ border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden', maxHeight: 360, overflowY: 'auto' }}>
            {preview.data.map((d, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '1.2fr 0.5fr 2fr',
                padding: '8px 12px', gap: 10, fontSize: 12.5,
                borderBottom: i < preview.data.length - 1 ? '1px solid var(--line)' : 'none',
                background: i % 2 ? 'var(--paper-2)' : 'var(--paper)',
              }}>
                <div style={{ fontWeight: 500 }}>{d.name}</div>
                <div><Tag tone={d.type === 'dinner' ? 'sage' : 'butter'}>{d.type}</Tag></div>
                <div style={{ color: 'var(--ink-3)', fontSize: 11.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.ingredients.join(' · ')}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {preview?.kind === 'json' && (
        <div style={{ padding: 20, background: 'var(--paper-2)', border: '1px solid var(--line)', borderRadius: 10 }}>
          <div style={{ fontSize: 13, marginBottom: 10 }}>About to restore from <b>{preview.name}</b>:</div>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, lineHeight: 1.8, color: 'var(--ink-2)' }}>
            <li><span className="mono">{(preview.data.meals || []).length}</span> meals</li>
            <li><span className="mono">{(preview.data.history || []).length}</span> finalized plans</li>
          </ul>
          <div style={{ fontSize: 12, color: 'var(--terra-ink)', marginTop: 10 }}>
            This replaces your current meals and history.
          </div>
        </div>
      )}
    </Modal>
  );
}

function ActionCard({ icon, title, subtitle, onClick }: { icon: React.ReactNode; title: string; subtitle: string; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        textAlign: 'left', display: 'flex', gap: 12, alignItems: 'flex-start',
        padding: 14, borderRadius: 12,
        background: hover ? 'var(--paper-2)' : 'var(--paper)',
        border: `1px solid ${hover ? 'var(--line-2)' : 'var(--line)'}`,
        transition: 'all .15s',
      }}>
      <div style={{
        width: 34, height: 34, borderRadius: 9,
        background: 'var(--sage-3)', color: 'var(--sage-ink)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{subtitle}</div>
      </div>
    </button>
  );
}
