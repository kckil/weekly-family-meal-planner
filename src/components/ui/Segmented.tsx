interface SegmentedProps {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
}

export function Segmented({ value, onChange, options }: SegmentedProps) {
  return (
    <div style={{
      display: 'inline-flex', padding: 3, background: 'var(--paper-2)',
      border: '1px solid var(--line)', borderRadius: 10, gap: 2,
    }}>
      {options.map(opt => {
        const active = opt.value === value;
        return (
          <button key={opt.value} onClick={() => onChange(opt.value)} style={{
            padding: '6px 12px', fontSize: 12.5, fontWeight: 500, borderRadius: 8,
            background: active ? 'var(--paper)' : 'transparent',
            color: active ? 'var(--ink)' : 'var(--ink-3)',
            boxShadow: active ? 'var(--shadow-sm)' : 'none',
            border: active ? '1px solid var(--line)' : '1px solid transparent',
            transition: 'all .15s',
          }}>{opt.label}</button>
        );
      })}
    </div>
  );
}
