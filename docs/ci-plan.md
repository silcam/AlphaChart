# CI Plan

Goal: every PR and every push to `master` reports a trustworthy pass/fail, so a
Dependabot PR can be triaged by looking at its checks instead of by pulling the
branch and running things by hand.

Status as of 2026-08-19.

---

## Where things stand

| Step | State | Notes |
| --- | --- | --- |
| 1. Typecheck job | **Done**, on `master` | `283bf4f` (typecheck + type fixes), `de347b3` (workflow). Not yet observed running on GitHub. |
| 2. Unit job (vitest + Mongo) | **Next** — branch `ci/unit-tests` | Plan below; nothing implemented yet. |
| 3. e2e job (Cypress) | Later | Wants some of step 4 done first. |
| 4. Repo changes that simplify CI | Later | Ordered list below. |
| 5. Dependabot config | Later | Independent of 2–4; can land any time. |
| 6. Branch protection + auto-merge | Last | Needs 2 and 3 green and stable. |

First thing to check when picking this up: did the typecheck workflow actually
run and pass on GitHub? It has never been observed on a runner. Two things in it
can only be verified there — `corepack enable` after `setup-node`, and whether
`~/.yarn/berry/cache` is the right cache path (a wrong path is a cache miss, not
a failure). `gh` is not installed locally, so check the Actions tab.

---

## Constraints CI has to respect

These are the facts behind the decisions further down. Each was verified by
reading or running the code, not assumed.

- **Unit tests need a real Mongo.** `server/src/storage/Data.ts:6` hardcodes
  `mongodb://localhost:27017`, with `serverSelectionTimeoutMS: 2500`. Each test
  file gets its own database (`acTest-<timestamp>-<rand>`) and drops it in
  `afterAll`/`afterEach`, so parallel vitest workers do not collide.
- **Neither vite nor vitest typechecks.** Both strip types with esbuild. This is
  why step 1 exists as its own job and why `vite build` is not a substitute.
- **Unit tests do not need a browser.** No test exercises the export endpoints
  (`/export/image`, `/export/pdf`), and importing `puppeteer` without a
  downloaded browser is lazy. Verified: the full suite passes 122/122 with
  `PUPPETEER_CACHE_DIR` pointed at a nonexistent directory. So the unit job can
  skip the puppeteer and Cypress binary downloads exactly like the typecheck job
  does (~350MB of postinstall).
- **`yarn cypress:run` hangs.** It runs `concurrently` over `tsc -w` plus
  `start-test` (itself `tsc -w` + nodemon + vite) plus `cypress run`, with no
  `-k` or `--success` flag. When Cypress exits, `concurrently` keeps waiting on
  the watchers forever. CI needs non-watch scripts.
- **`tsc` must finish before Cypress compiles specs.** Three files import
  `API_VERSION` from `server/dist/...`: `cypress/support/commands.js:27`,
  `cypress/e2e/create_account.cy.js:1`, `cypress/e2e/chart_editor.cy.js:1`.
- **e2e needs two servers.** Cypress `baseUrl` is `http://localhost:3000` (vite
  dev), and `client/vite.config.ts` proxies `/api`, `/test-db` and
  `/test-email` to `:3001`. The `beforeEach` in `cypress/support/commands.js`
  POSTs `/test-db/load-fixtures`, a route that only exists when the server runs
  with `NODE_ENV=test-cypress` (`server/src/app.ts:40`).
- **Puppeteer will likely fail on `ubuntu-latest`.**
  `server/src/controllers/exportController.ts:63` calls `puppeteer.launch()`
  with no args; Ubuntu 24.04's AppArmor blocks Chrome's unprivileged-userns
  sandbox. Affects the e2e job only (`export_chart.cy.js`).
- **No HTTP health target on `:3001`.** `server/src/app.ts:53`'s `app.get("*")`
  sendFiles `client/build/index.html`, absent in a dev-server run, so an HTTP
  probe there is unreliable. Hence `tcp:` in `wait-on` until a health endpoint
  exists.
- **Do not add a `paths:` filter.** Once these are required checks, a PR
  touching only `Gemfile.lock` (the bundler ecosystem is enabled) would never
  report a status and could not be merged.

---

## Step 2 — Unit job

Add to `.github/workflows/ci.yml` alongside `typecheck`.

**Script to add** to root `package.json` — `yarn test` is watch-mode by default:

```json
"test:ci": "NODE_ENV=test vitest run"
```

**Job:**

```yaml
  unit:
    name: Unit tests
    runs-on: ubuntu-latest
    timeout-minutes: 15
    env:
      PUPPETEER_SKIP_DOWNLOAD: "true"
      CYPRESS_INSTALL_BINARY: "0"
    services:
      mongo:
        image: mongo:8.0          # matches the local `alphamongo` container
        ports: ["27017:27017"]
        options: >-
          --health-cmd "mongosh --quiet --eval 'db.runCommand({ping:1})'"
          --health-interval 10s --health-timeout 5s --health-retries 10
    steps:
      # same checkout / setup-node / corepack / cache / install as `typecheck`
      - name: Unit tests
        run: yarn test:ci
```

Notes:

- The health check matters more than it looks: `Data.ts` gives up after 2500ms,
  so a not-quite-ready Mongo fails the suite rather than waiting for it.
- `mongosh` is present in `mongo:6`+ images. If the image is ever pinned lower,
  the health command has to become `mongo --eval ...`.
- Consider whether the shared setup steps are worth factoring into a composite
  action once there are three jobs. Probably not at three.
- Optional additions, deliberately left out of the first pass: a `build` job
  (`tsc` + `vite build`) to catch unresolvable imports, and coverage upload
  (`yarn coverage` already works).
- Small cleanup while in `vitest.config.ts`: the `**/*puppeteer*` exclude is
  vestigial — no such files exist.

---

## Step 3 — e2e job

Best done after the step 4 items marked **(unblocks e2e)**. Sketch:

```yaml
  e2e:
    name: Cypress e2e
    runs-on: ubuntu-latest      # only safe once puppeteer gets --no-sandbox
    timeout-minutes: 30
    services:
      mongo: # as above
    steps:
      # checkout / setup-node / corepack / install (WITH the binaries this time)
      - name: Cache Cypress and Chrome
        uses: actions/cache@v4
        with:
          path: |
            ~/.cache/Cypress
            ~/.cache/puppeteer
          key: browsers-${{ runner.os }}-${{ hashFiles('yarn.lock') }}
      - run: yarn tsc          # drop once the server/dist imports are gone
      - uses: cypress-io/github-action@v6
        with:
          install: false
          start: yarn start-test-ci
          wait-on: 'http://localhost:3000, tcp:127.0.0.1:3001'
          wait-on-timeout: 120
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: cypress-artifacts
          path: |
            cypress/screenshots
            cypress/videos
          if-no-files-found: ignore
```

Expect one or two iterations on this job. The Puppeteer sandbox behaviour cannot
be reproduced locally, so treat the first run as an experiment.

---

## Step 4 — Repo changes that make CI clean

Ordered by payoff. Each deletes a workaround or closes a signal gap.

1. **Cypress retries** — `cypress.config.ts`:
   `retries: { runMode: 2, openMode: 0 }`, plus `video: true` (Cypress 13
   defaults it off, and video is what you want when triaging a bot PR).
   *Highest priority of everything here.* A flaky suite makes the check
   meaningless — "nanoid broke it" becomes indistinguishable from "flake" and
   you are back to manual triage. Assume some flake exists after the Cypress 13
   migration.
2. **Non-watch e2e script** *(unblocks e2e)* — root `package.json`:
   ```json
   "start-test-ci": "yarn reset-cypress-images && NODE_ENV=test-cypress concurrently -k -n Server,Client -c green,magenta \"node server/dist/server/src/server.js\" \"yarn start-client\""
   ```
   `-k` means a crashed server kills the pair and fails fast, instead of a
   120-second `wait-on` timeout.
3. **Puppeteer CI args** *(unblocks e2e on `ubuntu-latest`)* —
   `server/src/controllers/exportController.ts:63`:
   ```ts
   await puppeteer.launch({
     args: process.env.CI ? ["--no-sandbox", "--disable-dev-shm-usage"] : []
   });
   ```
   The alternative is pinning the e2e job to `ubuntu-22.04`; this is better.
   `--disable-dev-shm-usage` also covers the small `/dev/shm` in containers.
4. **Drop the `server/dist` imports from Cypress** *(unblocks e2e)* — the three
   files listed above want only `API_VERSION` (`client/src/api/Api.ts:7`).
   Repoint them at `../../client/src/api/Api` and the `tsc`-before-Cypress
   ordering constraint disappears, along with the `yarn tsc` step. Also makes
   `cypress open` work on a fresh clone. Cypress 13's bundler should resolve a
   `.ts` import from a `.js` spec — **verify by running Cypress locally**; if it
   balks, rename the three files to `.ts`/`.cy.ts`.
5. **`MONGO_URL` env var** — `server/src/storage/Data.ts:6`:
   `const URL = process.env.MONGO_URL || "mongodb://localhost:27017";`
   Lets CI point somewhere else (container network, alternate port to avoid
   clashing with a local Mongo, sharding later). Consider making the 2500ms
   timeout env-tunable too — CI cold starts are slower than a laptop.
6. **Health endpoint + `app.get("*")` fix** — add `GET /api/health` → 200, and
   make the catch-all return an honest 404 when `client/build/index.html` is
   absent. Then `wait-on` drops the `tcp:` hack and a dead server fails fast.
7. **Delete `start-client.js`** — it is
   `child_process.spawn("yarn", ["start"], { shell: true, cwd: "client" })`, an
   extra shell layer that swallows SIGTERM, so vite orphans when a job is torn
   down. Replace the `start-client` script with
   `yarn workspace alphachart start`.
8. **Quiet `log.ts` in `test-cypress`** — `server/src/common/log.ts:14` silences
   only `NODE_ENV === "test"`, so the e2e job logs every request of every spec.
   Gate on a `LOG_LEVEL`/`DEBUG` check instead; makes failed-run logs readable.

---

## Step 5 — Dependabot config

`.github/dependabot.yml`. Highest-value change first: **split the
`patterns: ["*"]` group.** One group means a single bad package blocks the whole
batch, which is the situation that prompted this work.

```yaml
version: 2
updates:
  - package-ecosystem: "github-actions"   # new: otherwise the pinned actions rot
    directory: "/"
    schedule: { interval: "weekly" }

  - package-ecosystem: "npm"
    directory: "/"                        # yarn workspaces: covers client/ too
    schedule: { interval: "weekly", day: "monday" }
    open-pull-requests-limit: 10
    groups:
      npm-minor-patch:
        patterns: ["*"]
        update-types: ["minor", "patch"]
    # majors intentionally ungrouped -> one PR each, easy to isolate or revert

  - package-ecosystem: "bundler"
    directory: "/"
    schedule: { interval: "weekly", day: "monday" }
    groups:
      bundler-dependencies:
        patterns: ["*"]
```

---

## Step 6 — Branch protection and auto-merge

Only after the unit and e2e jobs have been green and stable for a few real
Dependabot PRs.

1. Make `Typecheck`, `Unit tests` and `Cypress e2e` required status checks on
   `master`.
2. Turn on the repository's "Allow auto-merge" setting.
3. Then add an auto-merge workflow for minor/patch Dependabot PRs.

Two traps: without required status checks, `gh pr merge --auto` merges
immediately instead of waiting; and Dependabot-triggered runs get a read-only
`GITHUB_TOKEN` by default, so the workflow needs an explicit `permissions:`
block. Check the current GitHub docs on `pull_request` vs `pull_request_target`
for Dependabot rather than working from memory — this behaviour has changed
before.

---

## Considered and declined

- **Single server serving `client/build` for e2e** (one process instead of two,
  more production-like). `reset-cypress-images` writes into
  `client/public/images` and vite copies `public/` at *build* time, so fixture
  images would need either a rebuild per run or a `/images` static mount —
  production routing bent for test purposes. It also moves `export_chart.cy.js`
  from the dev bundle to the built bundle while Puppeteer renders through
  `BASE_URL`, adding debugging surface to the most fragile spec.
- **`mongodb-memory-server`** to avoid the Mongo service — adds a dependency
  that downloads a mongod binary to replace what a service container already
  does for free. The `MONGO_URL` change gets the flexibility without the
  dependency.

## Needs no change

Checked, and fine as-is: `tmp/export/.keep` is tracked so the export directory
exists on checkout; `BASE_URL` (`server/src/app.ts:21`) already resolves to
`localhost:3000` off-production, which is where the dev server listens; and the
reset-password spec reads from `testSentEmailController`, not real SMTP.

## Local verification commands

```shell
docker start alphamongo     # the local Mongo; it is not always running
yarn typecheck              # server (incl. tests) + client (incl. tests)
yarn test --run             # 122 tests, ~10s
yarn tsc                    # server build, required before cypress today
yarn workspace alphachart build
```

Known-benign `yarn install` warnings: `@vitest/coverage-v8` requests vitest
4.0.18 against the project's 4.1.0, and `@testing-library/react` requests an
unprovided `@testing-library/dom`. Warnings only — `--immutable` still passes.
