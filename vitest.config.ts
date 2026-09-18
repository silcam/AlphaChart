import { defineConfig } from 'vitest/config'

const ALL_TESTS = ['server/**/*.test.ts', 'client/**/*.test.ts']
const INTEGRATION_TESTS = ['server/**/*.int.test.ts', 'client/**/*.int.test.ts']
// Need a real Chrome (downloaded by puppeteer's postinstall), but no Mongo.
const BROWSER_TESTS = ['server/**/*.browser.test.ts']
const ALWAYS_EXCLUDE = ['**/node_modules/**']

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
          // Everything except the *.int.test.ts files, which need a real Mongo,
          // and the *.browser.test.ts files, which need a real browser.
          include: ALL_TESTS,
          exclude: [...ALWAYS_EXCLUDE, ...INTEGRATION_TESTS, ...BROWSER_TESTS],
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
      },
      {
        test: {
          name: 'browser',
          environment: 'node',
          globals: true,
          // Requires the Chrome that puppeteer's postinstall downloads, so it
          // will not run where PUPPETEER_SKIP_DOWNLOAD is set. Deliberately
          // separate from `integration`: this needs a browser, not a database.
          // Launching Chrome and rendering is slower than the unit suite.
          include: BROWSER_TESTS,
          exclude: ALWAYS_EXCLUDE,
          // The suite serves client/public here and points exportController at
          // it. A port of its own, so a running dev server (or anything else
          // squatting on 3000) can neither block the suite nor answer for it.
          env: { BASE_URL: 'http://127.0.0.1:3999' },
          testTimeout: 60000,
          hookTimeout: 60000
        }
      }
    ]
  }
})
