import { parseCSV, toCSV } from '../utils/csv';
import type { Meal } from '../types';

describe('parseCSV', () => {
  it('parses standard dinner entries', () => {
    const result = parseCSV('Chicken Tacos, dinner, chicken thighs; corn tortillas; avocado');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Chicken Tacos');
    expect(result[0].type).toBe('dinner');
    expect(result[0].ingredients).toEqual(['chicken thighs', 'corn tortillas', 'avocado']);
  });

  it('parses breakfast entries', () => {
    const result = parseCSV('Oatmeal, breakfast, rolled oats; blueberries');
    expect(result[0].type).toBe('breakfast');
  });

  it('handles multiple lines', () => {
    const csv = `Tacos, dinner, beef; tortillas
Oatmeal, breakfast, oats; berries
Pasta, dinner, noodles; sauce`;
    expect(parseCSV(csv)).toHaveLength(3);
  });

  it('skips invalid types', () => {
    const result = parseCSV('Snack, lunch, crackers; cheese');
    expect(result).toHaveLength(0);
  });

  it('skips empty lines', () => {
    const csv = `Tacos, dinner, beef; tortillas\n\n\nPasta, dinner, noodles`;
    expect(parseCSV(csv)).toHaveLength(2);
  });

  it('skips lines without enough commas', () => {
    const result = parseCSV('Just a name');
    expect(result).toHaveLength(0);
  });

  it('handles quoted fields', () => {
    const result = parseCSV('"Chicken Tacos", dinner, "chicken; tortillas; avocado"');
    expect(result[0].name).toBe('Chicken Tacos');
  });

  it('handles Windows line endings', () => {
    const csv = 'Tacos, dinner, beef\r\nPasta, dinner, noodles';
    expect(parseCSV(csv)).toHaveLength(2);
  });
});

describe('toCSV', () => {
  it('exports meals to CSV format', () => {
    const meals: Meal[] = [
      { id: '1', name: 'Tacos', type: 'dinner', ingredients: ['beef', 'tortillas'], timesUsed: 0, lastUsed: null },
      { id: '2', name: 'Oatmeal', type: 'breakfast', ingredients: ['oats', 'berries'], timesUsed: 0, lastUsed: null },
    ];
    const csv = toCSV(meals);
    expect(csv).toBe('Tacos, dinner, beef; tortillas\nOatmeal, breakfast, oats; berries');
  });

  it('roundtrips through parseCSV', () => {
    const meals: Meal[] = [
      { id: '1', name: 'Chicken Stir Fry', type: 'dinner', ingredients: ['chicken', 'broccoli', 'ginger'], timesUsed: 3, lastUsed: '2025-01-01' },
    ];
    const csv = toCSV(meals);
    const parsed = parseCSV(csv);
    expect(parsed[0].name).toBe('Chicken Stir Fry');
    expect(parsed[0].type).toBe('dinner');
    expect(parsed[0].ingredients).toEqual(['chicken', 'broccoli', 'ginger']);
  });
});
