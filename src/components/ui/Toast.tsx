import { Icons } from './Icons';

export function Toast({ toast }: { toast: string | null }) {
  if (!toast) return null;
  return (
    <div style={{
      position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
      background: 'var(--ink)', color: 'var(--paper)',
      padding: '10px 16px', borderRadius: 999, boxShadow: 'var(--shadow-lg)',
      zIndex: 200, fontSize: 13, fontWeight: 500,
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      {Icons.Check}
      {toast}
    </div>
  );
}
