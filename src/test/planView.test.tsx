import { render, screen } from '@testing-library/react';
import { PlanView } from '../components/PlanView';
import type { Meal, WeeklyPlan } from '../types';

const meals: Meal[] = [
  { id: 'd1', name: 'Tacos', type: 'dinner', ingredients: ['beef', 'tortillas'], timesUsed: 0, lastUsed: null },
  { id: 'd2', name: 'Pasta', type: 'dinner', ingredients: ['noodles', 'sauce'], timesUsed: 0, lastUsed: null },
  { id: 'd3', name: 'Steak', type: 'dinner', ingredients: ['steak', 'potatoes'], timesUsed: 0, lastUsed: null },
  { id: 'd4', name: 'Curry', type: 'dinner', ingredients: ['tofu', 'coconut'], timesUsed: 0, lastUsed: null },
  { id: 'd5', name: 'Soup', type: 'dinner', ingredients: ['chicken', 'noodles'], timesUsed: 0, lastUsed: null },
  { id: 'd6', name: 'Pizza', type: 'dinner', ingredients: ['dough', 'cheese'], timesUsed: 0, lastUsed: null },
  { id: 'b1', name: 'Oatmeal', type: 'breakfast', ingredients: ['oats'], timesUsed: 0, lastUsed: null },
  { id: 'b2', name: 'Toast', type: 'breakfast', ingredients: ['bread'], timesUsed: 0, lastUsed: null },
  { id: 'b3', name: 'Eggs', type: 'breakfast', ingredients: ['eggs'], timesUsed: 0, lastUsed: null },
  { id: 'b4', name: 'Smoothie', type: 'breakfast', ingredients: ['banana'], timesUsed: 0, lastUsed: null },
  { id: 'b5', name: 'Yogurt', type: 'breakfast', ingredients: ['yogurt'], timesUsed: 0, lastUsed: null },
  { id: 'b6', name: 'Pancakes', type: 'breakfast', ingredients: ['flour'], timesUsed: 0, lastUsed: null },
];

const plan: WeeklyPlan = {
  id: 'p1',
  createdAt: '2025-04-20T00:00:00Z',
  finalized: false,
  days: [
    { day: 'Sun', breakfast: 'b1', lunch: null, lunchIsLeftover: false, dinner: 'd1' },
    { day: 'Mon', breakfast: 'b2', lunch: 'd1', lunchIsLeftover: true, dinner: 'd2' },
    { day: 'Tue', breakfast: 'b3', lunch: 'd2', lunchIsLeftover: true, dinner: 'd3' },
    { day: 'Wed', breakfast: 'b4', lunch: 'd3', lunchIsLeftover: true, dinner: 'd4' },
    { day: 'Thu', breakfast: 'b5', lunch: 'd4', lunchIsLeftover: true, dinner: 'd5' },
    { day: 'Fri', breakfast: 'b6', lunch: 'd5', lunchIsLeftover: true, dinner: 'd6' },
  ],
};

describe('PlanView', () => {
  const defaultProps = {
    plan,
    meals,
    dragState: null,
    setDragState: vi.fn(),
    filter: 'all',
    setFilter: vi.fn(),
    onDropMeal: vi.fn(),
    onClear: vi.fn(),
    onRegenerate: vi.fn(),
    onFinalize: vi.fn(),
    onClearAll: vi.fn(),
    onOpenLibrary: vi.fn(),
  };

  // Regression test: ensure the "Surprise Me!" button renders correctly
  // (previously a replace_all corrupted prop names with "!" in them)
  it('renders the Surprise Me! button without errors', () => {
    render(<PlanView {...defaultProps} />);
    expect(screen.getAllByText('Surprise Me!').length).toBeGreaterThan(0);
  });

  it('renders Finalize plan button', () => {
    render(<PlanView {...defaultProps} />);
    expect(screen.getByText('Finalize plan')).toBeInTheDocument();
  });

  it('shows Finalized when plan is finalized', () => {
    render(<PlanView {...defaultProps} plan={{ ...plan, finalized: true }} />);
    expect(screen.getByText('Finalized')).toBeInTheDocument();
  });

  it('renders all day labels', () => {
    render(<PlanView {...defaultProps} />);
    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Fri')).toBeInTheDocument();
  });

  it('renders meal names in the grid', () => {
    render(<PlanView {...defaultProps} />);
    // Tacos appears in dinner and as sidebar card
    expect(screen.getAllByText('Tacos').length).toBeGreaterThan(0);
  });

  it('shows SHOPPING DAY for Sunday lunch', () => {
    render(<PlanView {...defaultProps} />);
    expect(screen.getByText('SHOPPING DAY')).toBeInTheDocument();
  });

  it('shows leftovers indicator', () => {
    render(<PlanView {...defaultProps} />);
    const leftovers = screen.getAllByText('↺ leftovers');
    expect(leftovers.length).toBe(5); // Mon-Fri
  });
});
