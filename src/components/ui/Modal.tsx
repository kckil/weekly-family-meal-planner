import { useEffect, type ReactNode } from 'react';
import { Icons } from './Icons';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: number;
  footer?: ReactNode;
}

export function Modal({ open, onClose, title, children, width = 560, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'oklch(0.18 0.01 80 / 0.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, padding: 40, backdropFilter: 'blur(2px)',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width, maxWidth: '100%', maxHeight: '80vh', display: 'flex', flexDirection: 'column',
        background: 'var(--paper)', borderRadius: 14, border: '1px solid var(--line)',
        boxShadow: 'var(--shadow-lg)', overflow: 'hidden',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="serif" style={{ fontSize: 20 }}>{title}</div>
          <button onClick={onClose} style={{ padding: 4, color: 'var(--ink-3)' }}>{Icons.X}</button>
        </div>
        <div className="scroll" style={{ padding: 20, overflow: 'auto', flex: 1 }}>{children}</div>
        {footer && (
          <div style={{ padding: '14px 20px', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'flex-end', gap: 10, background: 'var(--paper-2)' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
