import type { CSSProperties, ReactNode } from 'react';

interface TextInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  icon?: ReactNode;
  style?: CSSProperties;
}

export function TextInput({ value, onChange, placeholder, icon, style }: TextInputProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      background: 'var(--paper)', border: '1px solid var(--line-2)',
      borderRadius: 10, padding: '8px 12px', ...style,
    }}>
      {icon && <span style={{ color: 'var(--ink-3)', display: 'flex' }}>{icon}</span>}
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ flex: 1, border: 0, outline: 0, background: 'transparent', fontSize: 13.5 }}/>
    </div>
  );
}
