export function relDate(iso: string | null): string {
  if (!iso) return 'never';
  const d = new Date(iso);
  const diff = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (diff <= 0) return 'today';
  if (diff === 1) return 'yesterday';
  if (diff < 7) return diff + ' days ago';
  if (diff < 30) return Math.floor(diff / 7) + 'w ago';
  if (diff < 365) return Math.floor(diff / 30) + 'mo ago';
  return Math.floor(diff / 365) + 'y ago';
}

export function shortDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function weekRangeLabel(iso: string): string {
  const d = new Date(iso);
  const end = new Date(d.getTime() + 5 * 86400000);
  const fmt = (x: Date) => x.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return `${fmt(d)} – ${fmt(end)}`;
}
