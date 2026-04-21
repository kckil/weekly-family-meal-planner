import { useState, type CSSProperties, type DragEvent, type ReactNode } from 'react';
import type { Meal } from '../types';
import { TypeDot, Icons } from './ui';

interface MealCardProps {
  meal: Meal;
  compact?: boolean;
  draggable?: boolean;
  dragHandle?: boolean;
  ghost?: boolean;
  onDragStart?: (e: DragEvent) => void;
  onDragEnd?: (e: DragEvent) => void;
  onClick?: () => void;
  style?: CSSProperties;
  actions?: ReactNode;
}

export function MealCard({ meal, compact, draggable, dragHandle, ghost, onDragStart, onDragEnd, onClick, style, actions }: MealCardProps) {
  const [hover, setHover] = useState(false);
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        display: 'flex', alignItems: 'center', gap: 10,
        padding: compact ? '8px 10px' : '10px 12px',
        background: 'var(--paper)',
        border: `1px solid ${hover ? 'var(--line-2)' : 'var(--line)'}`,
        borderRadius: 10,
        boxShadow: hover ? 'var(--shadow-sm)' : 'none',
        cursor: draggable ? 'grab' : (onClick ? 'pointer' : 'default'),
        opacity: ghost ? 0.5 : 1,
        transition: 'border-color .15s, box-shadow .15s',
        ...style,
      }}>
      {dragHandle && <span style={{ color: 'var(--ink-3)', display: 'flex', marginLeft: -2 }}>{Icons.Drag}</span>}
      <TypeDot type={meal.type}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: compact ? 13 : 13.5, fontWeight: 500, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{meal.name}</div>
        {!compact && (
          <div style={{ fontSize: 11.5, color: 'var(--ink-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
            {meal.ingredients.slice(0, 3).join(' · ')}{meal.ingredients.length > 3 ? ' …' : ''}
          </div>
        )}
      </div>
      {actions}
    </div>
  );
}
