import type { MealType } from '../../types';

interface TypeDotProps {
  type: MealType;
  size?: number;
}

export function TypeDot({ type, size = 8 }: TypeDotProps) {
  const color = type === 'breakfast' ? 'var(--butter)' : 'var(--sage-2)';
  const border = type === 'breakfast' ? 'oklch(0.78 0.08 90)' : 'oklch(0.58 0.07 150)';
  return <span style={{ display: 'inline-block', width: size, height: size, borderRadius: 999, background: color, border: `1px solid ${border}` }}/>;
}
