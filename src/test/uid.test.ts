import { uid } from '../utils/uid';

describe('uid', () => {
  it('returns a string', () => {
    expect(typeof uid()).toBe('string');
  });

  it('returns different values each call', () => {
    const ids = Array.from({ length: 100 }, () => uid());
    expect(new Set(ids).size).toBe(100);
  });

  it('is at least 6 characters', () => {
    expect(uid().length).toBeGreaterThanOrEqual(6);
  });
});
