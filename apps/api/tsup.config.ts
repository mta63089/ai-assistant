import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/server.ts'],
  outDir: 'dist',
  target: 'node22',
  format: ['esm'],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: false,
  shims: true
})
