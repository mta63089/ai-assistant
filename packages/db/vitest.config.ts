import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      include: ['src']
    },
    outputFile: './src/test/test-results.json',
    reporters: ['json', 'verbose']
  }
});
