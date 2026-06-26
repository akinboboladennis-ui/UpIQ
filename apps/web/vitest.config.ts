import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['**/__tests__/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/.next/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['lib/**/*.ts', 'stores/**/*.ts', 'hooks/**/*.ts'],
      exclude: [
        'lib/supabase/**', // thin wrappers over Supabase SDK
        'lib/utils.ts', // shadcn utility
        'lib/monitoring.ts', // placeholder adapters (no logic)
        '**/*.d.ts',
      ],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 55,
        statements: 60,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
      '@upiq/shared': resolve(__dirname, '../../packages/shared/src'),
    },
  },
})
