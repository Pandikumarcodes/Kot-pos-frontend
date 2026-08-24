# Testing

## Unit and component tests

Vitest is configured in `vitest.config.mts` to include `src/__tests__/**/*.test.{ts,tsx}`. It uses:

- jsdom as the browser environment;
- Testing Library and `@testing-library/jest-dom`;
- shared setup in `src/__tests__/setup/testSetup.ts`;
- globally available Vitest APIs;
- a 10-second test timeout.

The current suites cover UI components, feature containers/presenters, hooks, route guards, API services and compatibility behavior, Redux slices, and permission helpers.

```bash
npm test
npm run test:watch
```

## Coverage configuration

V8 coverage is configured for text, LCOV, and HTML output under `coverage/`. The configured minimums are 80% for lines, functions, and statements and 75% for branches.

There is currently no `test:coverage` script in `package.json`. To invoke the installed provider directly:

```bash
npx vitest run --coverage
```

Coverage thresholds apply when coverage is requested; the normal `npm test` script runs `vitest run` without coverage.

## Static checks

```bash
npm run typecheck
npm run lint
npm run build
```

`typecheck` runs `tsc -b --noEmit`. The application TypeScript configuration is strict and targets ES2022. `lint` runs ESLint over the repository.

## End-to-end tests

Playwright uses `e2e/` and runs two projects:

1. `setup` logs in sequentially and saves authenticated browser state.
2. `chromium` depends on setup and runs the main specs with Desktop Chrome settings.

The suite starts `npm run dev` at `http://localhost:5173`, or reuses an existing server outside CI. It is fully parallel for the main suite, retries twice and uses one worker in CI, records a trace on first retry, and captures screenshot/video evidence on failures/retries as configured.

```bash
npm run e2e
npm run e2e:ui
npm run e2e:debug
npm run e2e:headed
npm run e2e:report
```

### E2E prerequisites

- Playwright browser binaries (`npx playwright install` locally).
- A compatible, reachable, seeded backend.
- All username/password variables for admin, manager, waiter, chef, and cashier listed in `.env.example`.

`e2e/helpers/testCredentials.ts` throws before the run if any required credential variable is missing. It reads `process.env` directly; Playwright does not load the repository `.env` automatically. Superadmin does not currently have a Playwright credential or saved-state project.

## CI

`.github/workflows/playwright.yml` runs on pushes and pull requests targeting `main` or `master` with Node 20.

- `quality` installs with `npm ci`, then runs lint, typecheck, unit tests, and production build.
- `test` depends on `quality`, installs Playwright browsers, obtains E2E accounts from GitHub Actions secrets, runs the browser suite, and uploads the HTML report for 30 days even when tests fail (unless cancelled).

## Test-environment boundary

Unit tests mock network and browser behavior where appropriate. Playwright is an integration suite: its result depends on external backend availability, seed data, cookie configuration, and valid role accounts. Do not describe a listed or credential-blocked suite as a passing E2E run.
