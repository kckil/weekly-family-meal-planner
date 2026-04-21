import { useState, type CSSProperties, type ReactNode } from 'react';

type Variant = 'primary' | 'accent' | 'outline' | 'ghost' | 'subtle';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  style?: CSSProperties;
  title?: string;
}

const sizes: Record<Size, CSSProperties> = {
  sm: { padding: '7px 11px', fontSize: 13 },
  md: { padding: '10px 14px', fontSize: 13.5 },
  lg: { padding: '13px 20px', fontSize: 15 },
};

const variants: Record<Variant, CSSProperties> = {
  primary: { background: 'var(--sage-ink)', color: 'var(--paper)', border: '1px solid var(--sage-ink)' },
  accent:  { background: 'var(--terra)', color: '#fff', border: '1px solid var(--terra)' },
  outline: { background: 'var(--paper)', color: 'var(--ink)', border: '1px solid var(--line-2)' },
  ghost:   { background: 'transparent', color: 'var(--ink-2)', border: '1px solid transparent' },
  subtle:  { background: 'var(--paper-2)', color: 'var(--ink)', border: '1px solid var(--line)' },
};

const hoverStyles: Record<Variant, CSSProperties> = {
  primary: { background: 'oklch(0.34 0.05 150)' },
  accent:  { background: 'oklch(0.58 0.12 45)' },
  outline: { background: 'var(--paper-2)', borderColor: 'var(--line-2)' },
  ghost:   { background: 'var(--paper-2)' },
  subtle:  { background: 'var(--paper-3)' },
};

export function Button({ variant = 'ghost', size = 'md', icon, children, onClick, disabled, style, title }: ButtonProps) {
  const [hover, setHover] = useState(false);
  const base: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    borderRadius: 10,
    fontWeight: 500,
    letterSpacing: '-0.005em',
    transition: 'all .15s ease',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    lineHeight: 1,
  };

  return (
    <button
      type="button" onClick={onClick} disabled={disabled} title={title}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        ...base, ...sizes[size], ...variants[variant],
        ...(!disabled && hover ? hoverStyles[variant] : {}),
        ...style,
      }}>
      {icon}
      {children}
    </button>
  );
}
