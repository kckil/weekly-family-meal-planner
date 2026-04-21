import { useState, useMemo } from 'react';
import type { Meal, WeeklyPlan } from '../types';
import { relDate, weekRangeLabel } from '../utils/dates';
import { Button, Tag, SectionHeading, TypeDot } from './ui';

interface HistoryViewProps {
  history: WeeklyPlan[];
  meals: Meal[];
}

export function HistoryView({ history, meals }: HistoryViewProps) {
  const topMeals = useMemo(() => [...meals].sort((a, b) => b.timesUsed - a.timesUsed).slice(0, 8), [meals]);
  const neverUsed = useMemo(() => meals.filter(m => m.timesUsed === 0), [meals]);
  const maxUses = Math.max(1, ...topMeals.map(m => m.timesUsed));

  return (
    <div>
      <SectionHeading eyebrow="Past plans" title="History">
        {history.length} finalized {history.length === 1 ? 'plan' : 'plans'}
      </SectionHeading>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20 }}>
        <div>
          {history.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', border: '1px dashed var(--line-2)', borderRadius: 14, color: 'var(--ink-3)' }}>
              No finalized plans yet. Build a week and click <b>Finalize</b> to record it.
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {history.map(p => <PlanRow key={p.id} plan={p} meals={meals}/>)}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <StatsCard title="Most-made meals">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {topMeals.map(m => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <TypeDot type={m.type}/>
                  <div style={{ flex: 1, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
                  <div style={{ width: 90, height: 6, background: 'var(--paper-3)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ width: `${(m.timesUsed / maxUses) * 100}%`, height: '100%', background: 'var(--sage-ink)' }}/>
                  </div>
                  <div className="mono" style={{ fontSize: 12, color: 'var(--ink-2)', width: 20, textAlign: 'right' }}>{m.timesUsed}</div>
                </div>
              ))}
            </div>
          </StatsCard>

          <StatsCard title={`Never made (${neverUsed.length})`}>
            {neverUsed.length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>You've tried every meal in your library.</div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {neverUsed.map(m => <Tag key={m.id} tone={m.type === 'dinner' ? 'sage' : 'butter'}>{m.name}</Tag>)}
              </div>
            )}
          </StatsCard>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 14, padding: 18, boxShadow: 'var(--shadow-sm)' }}>
      <div className="serif" style={{ fontSize: 18, marginBottom: 14 }}>{title}</div>
      {children}
    </div>
  );
}

function PlanRow({ plan, meals }: { plan: WeeklyPlan; meals: Meal[] }) {
  const [open, setOpen] = useState(false);
  const byId = Object.fromEntries(meals.map(m => [m.id, m]));
  const dinners = plan.days.map(d => byId[d.dinner!]?.name).filter(Boolean);
  return (
    <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 14, padding: 16, boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ flex: 1 }}>
          <div className="serif" style={{ fontSize: 22 }}>{weekRangeLabel(plan.createdAt)}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>
            Finalized {relDate(plan.createdAt)} · {new Set(dinners).size} unique dinners
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => setOpen(!open)}>{open ? 'Hide' : 'View'} meals</Button>
      </div>
      {open && (
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
          {plan.days.map(d => (
            <div key={d.day} style={{ background: 'var(--paper-2)', border: '1px solid var(--line)', borderRadius: 10, padding: 10 }}>
              <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)', letterSpacing: '0.08em', marginBottom: 6 }}>{d.day.toUpperCase()}</div>
              <DayLine label="B" id={d.breakfast} byId={byId}/>
              <DayLine label="L" id={d.lunch} byId={byId} leftover={d.lunchIsLeftover}/>
              <DayLine label="D" id={d.dinner} byId={byId}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DayLine({ label, id, byId, leftover }: { label: string; id: string | null; byId: Record<string, Meal>; leftover?: boolean }) {
  const m = id ? byId[id] : null;
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'baseline', fontSize: 11.5, color: 'var(--ink-2)', lineHeight: 1.45 }}>
      <span className="mono" style={{ color: 'var(--ink-3)', width: 10 }}>{label}</span>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {m ? m.name : <span style={{ color: 'var(--ink-3)', fontStyle: 'italic' }}>—</span>}
        {leftover && m && <span style={{ color: 'var(--ink-3)', marginLeft: 4 }}>↺</span>}
      </span>
    </div>
  );
}
