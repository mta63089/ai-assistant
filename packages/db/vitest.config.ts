import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      include: ['src']
    },
    outputFile: './src/test/test-results.json',
    reporters: ['json', 'verbose']
  }
});
