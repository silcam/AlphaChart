import { defineConfig } from 'vitest/config'

const ALL_TESTS = ['server/**/*.test.ts', 'client/**/*.test.ts']
const INTEGRATION_TESTS = ['server/**/*.int.test.ts', 'client/**/*.int.test.ts']
const ALWAYS_EXCLUDE = ['**/node_modules/**', '**/*puppeteer*']

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8'
    },
    projects: [
      {
        test: {
          name: 'unit',
          environment: 'node',
          globals: true,
          // Everything except the *.int.test.ts files, which need a real Mongo.
          include: ALL_TESTS,
          exclude: [...ALWAYS_EXCLUDE, ...INTEGRATION_TESTS],
          setupFiles: ['test/no-mongo.setup.ts']
        }
      },
      {
        test: {
          name: 'integration',
          environment: 'node',
          globals: true,
          // Requires mongod listening on localhost:27017.
          include: INTEGRATION_TESTS,
          exclude: ALWAYS_EXCLUDE
        }
      }
    ]
  }
})
