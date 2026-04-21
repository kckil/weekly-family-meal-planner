import type { ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  right?: ReactNode;
  children?: ReactNode;
}

export function SectionHeading({ eyebrow, title, right, children }: SectionHeadingProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 18 }}>
      <div>
        {eyebrow && <div style={{ fontSize: 11.5, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 6 }}>{eyebrow}</div>}
        <div className="serif" style={{ fontSize: 34, lineHeight: 1.05 }}>{title}</div>
        {children && <div style={{ marginTop: 6, color: 'var(--ink-2)', fontSize: 14 }}>{children}</div>}
      </div>
      {right && <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>{right}</div>}
    </div>
  );
}
