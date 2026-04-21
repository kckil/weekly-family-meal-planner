import { relDate, shortDate, weekRangeLabel } from '../utils/dates';

describe('relDate', () => {
  it('returns "never" for null', () => {
    expect(relDate(null)).toBe('never');
  });

  it('returns "today" for now', () => {
    expect(relDate(new Date().toISOString())).toBe('today');
  });

  it('returns "yesterday" for 1 day ago', () => {
    const d = new Date(Date.now() - 86400000);
    expect(relDate(d.toISOString())).toBe('yesterday');
  });

  it('returns "X days ago" for 2-6 days', () => {
    const d = new Date(Date.now() - 3 * 86400000);
    expect(relDate(d.toISOString())).toBe('3 days ago');
  });

  it('returns weeks for 7-29 days', () => {
    const d = new Date(Date.now() - 14 * 86400000);
    expect(relDate(d.toISOString())).toBe('2w ago');
  });

  it('returns months for 30-364 days', () => {
    const d = new Date(Date.now() - 60 * 86400000);
    expect(relDate(d.toISOString())).toBe('2mo ago');
  });
});

describe('shortDate', () => {
  it('returns dash for null', () => {
    expect(shortDate(null)).toBe('—');
  });

  it('formats a date', () => {
    const result = shortDate('2025-03-15T12:00:00Z');
    expect(result).toMatch(/Mar/);
    expect(result).toMatch(/15/);
  });
});

describe('weekRangeLabel', () => {
  it('returns a range string', () => {
    const label = weekRangeLabel('2025-01-05T00:00:00Z');
    expect(label).toContain('–');
  });
});
