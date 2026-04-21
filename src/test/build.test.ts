/**
 * @vitest-environment node
 */
import { execSync } from 'child_process';
import { resolve } from 'path';

describe('build', () => {
  it('passes TypeScript type-checking (tsc -b)', () => {
    const root = resolve(__dirname, '../..');
    // Catches config issues like wrong defineConfig import or invalid tsconfig
    expect(() => execSync('npx tsc -b', { cwd: root, stdio: 'pipe' })).not.toThrow();
  });
});
