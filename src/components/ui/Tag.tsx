import type { CSSProperties, ReactNode } from 'react';

type Tone = 'neutral' | 'sage' | 'terra' | 'butter' | 'sky';

const tones: Record<Tone, { bg: string; fg: string; bd: string }> = {
  neutral: { bg: 'var(--paper-3)', fg: 'var(--ink-2)', bd: 'var(--line)' },
  sage:    { bg: 'var(--sage-3)', fg: 'var(--sage-ink)', bd: 'oklch(0.88 0.04 150)' },
  terra:   { bg: 'var(--terra-2)', fg: 'var(--terra-ink)', bd: 'oklch(0.87 0.05 45)' },
  butter:  { bg: 'var(--butter)', fg: 'oklch(0.36 0.08 85)', bd: 'oklch(0.85 0.06 90)' },
  sky:     { bg: 'var(--sky)', fg: 'oklch(0.36 0.06 230)', bd: 'oklch(0.82 0.04 230)' },
};

interface TagProps {
  tone?: Tone;
  children: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
}

export function Tag({ tone = 'neutral', children, style, onClick }: TagProps) {
  const t = tones[tone];
  return (
    <span onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: 11.5, fontWeight: 500, letterSpacing: '0.01em',
      padding: '3px 8px', borderRadius: 999,
      background: t.bg, color: t.fg, border: `1px solid ${t.bd}`,
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}>{children}</span>
  );
}
