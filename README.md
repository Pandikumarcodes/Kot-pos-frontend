# KOT POS Frontend

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Unit tests](https://img.shields.io/badge/unit%20tests-122%20passing-brightgreen)](#current-test-status)
[![License](https://img.shields.io/badge/license-MIT-green)](#license)

KOT POS is a responsive restaurant point-of-sale frontend for dine-in and
takeaway operations. It provides role-specific workflows for administrators,
managers, waiters, chefs, and cashiers, including table allocation, multi-round
ordering, kitchen order tickets, billing, inventory, reporting, and public QR
ordering.

The application is a React single-page application and requires a compatible
backend API. API requests use the `/api/v1` contract represented in
`src/services`.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Architecture](#architecture)
- [Security](#security)
- [Performance](#performance)
- [Testing](#testing)
- [Production Readiness](#production-readiness)
- [Future Improvements](#future-improvements)
- [License](#license)

## Features

### Authentication

- Public sign-in and account-registration screens with client-side validation.
- Cookie-based sessions with credentials included on authenticated API calls.
- Session restoration through `/auth/me` when the application starts.
- Automatic access-token refresh with queued retries for concurrent `401`
  responses.
- Logout and role-specific post-login redirects.

### POS

- Dine-in ordering from allocated tables.
- Multi-round ordering with menu search, category filters, quantities, and
  running totals.
- Cashier takeaway flow from customer details through KOT and payment.
- Cash, card, and UPI payment selection.
- Bill history, unpaid-bill settlement, GST invoice previews, and 80 mm receipt
  printing.

### Kitchen (KOT)

- Live kitchen board for dine-in and takeaway tickets.
- Pending, preparing, ready, served, and cancelled filters and counters.
- Start, mark-ready, and cancel actions.
- Real-time KOT additions and status changes through Socket.IO.

### Order Management

- Table-level order history and combined totals across ordering rounds.
- Search and filtering by status, date, and table number.
- Order detail views and manual refresh.
- Waiter handoff of completed table orders to the cashier.

### Inventory

- Create, edit, search, filter, and remove inventory items.
- Low-stock counts and category filtering.
- Restock and manual stock-adjustment workflows.
- Per-item stock history with quantity-before and quantity-after records.
- Optional association between inventory and menu items.

### Menu

- Create, update, search, filter, and delete menu items.
- Category, price, and availability management.
- Manager access to menu maintenance with admin-only deletion.

### Staff

- Staff listing, search, creation, role updates, and deletion.
- Active and locked staff summaries.
- Admin-only staff-management route and actions.

### Tables

- Table status overview and filtering.
- Table creation, deletion, customer allocation, and order navigation.
- Available, occupied, billing, reserved, and cleaning states.
- Per-table QR-code generation for public ordering.

### Reports

- Revenue, order, bill, average-order-value, dine-in, and takeaway summaries.
- Top-selling items, payment-method breakdowns, and hourly performance.
- Today, week, month, and custom date ranges.
- Chart.js visualizations.

### Dashboard

- Range-based operational summary for administrators and managers.
- Revenue, order, and table-occupancy statistics.
- Top items, payment methods, hourly sales, and table status views.
- Quick navigation to common operational screens.

### QR Ordering

- Public menu at `/menu/:tableId` without an authenticated staff session.
- Category browsing, cart management, optional customer details, and checkout.
- Order confirmation with a reference number.
- Order-status polling every ten seconds after checkout.

### Offline / PWA

- Web app manifest, install metadata, application icons, and iOS splash assets.
- Service-worker registration with static-asset caching.
- Network-first navigation with a dedicated offline fallback page.
- API responses bypass Cache Storage; orders and other live data still require a
  network connection.

### Notifications

- Role-based Socket.IO subscriptions for new orders, KOT updates, table updates,
  and billing events.
- Generated Web Audio tones for operational events.
- Shared toast feedback for user actions and API rate-limit handling.
- Connection-state feedback on the kitchen board.

### Role-Based Access

- Protected routes for `admin`, `manager`, `waiter`, `chef`, and `cashier`.
- Role-specific home pages and sidebar navigation.
- Feature-level permission checks for sensitive actions.
- Redirects prevent authenticated users from opening unauthorized routes.

### Additional Administration

- Customer CRUD with order and spending summaries.
- Branch creation, updates, activation, staff assignment, and branch summaries.
- Restaurant, billing, payment, and notification settings.
- API-backed AI chat, daily summaries, and inventory-alert views.

## Tech Stack

| Area | Implementation |
| --- | --- |
| Frontend | React 19, React DOM, Lucide React, Chart.js, QRCode React |
| State Management | Redux Toolkit and React Redux for global state; React hooks for feature-local state |
| Data Fetching | Axios for REST APIs, Socket.IO Client for live events, interval polling for QR order status |
| Routing | React Router DOM 7 with lazy-loaded protected routes |
| Styling | Tailwind CSS 4, shared theme tokens, and reusable UI components |
| Forms | Controlled React inputs with repository-local validation utilities |
| Testing | Vitest, jsdom, Testing Library, and Playwright |
| Build Tool | Vite 7 through the `rolldown-vite` package alias |
| Language | TypeScript 5.9 in strict mode |

`@tanstack/react-query` is installed, but the application does not currently
create a `QueryClient` or use React Query hooks. Current server-state fetching
is implemented with Axios and feature-local React state.

## Project Structure

```text
.
├── .github/workflows/       # Playwright workflow for pushes and pull requests
├── docs/                    # Backend contract and project documentation
├── e2e/                     # Playwright auth, RBAC, order, and QR scenarios
├── public/
│   ├── icons/               # PWA icon and splash-screen assets
│   ├── manifest.json        # Web app manifest
│   ├── offline.html         # Offline navigation fallback
│   └── sw.js                # Service worker
├── src/
│   ├── __tests__/           # Vitest unit tests and shared test setup
│   ├── charts/              # Dashboard and report charts
│   ├── config/              # API endpoints, permissions, and constants
│   ├── Context/             # Toast context and provider
│   ├── design-system/       # Application shell components
│   ├── errorBoundary/       # Top-level React error boundary
│   ├── features/            # Role- and domain-oriented feature modules
│   ├── hooks/               # Notifications, printing, permissions, and PWA hooks
│   ├── Router/              # Route definitions and access guards
│   ├── services/            # Axios clients and domain API modules
│   ├── Store/               # Redux store, typed hooks, and slices
│   ├── UiComponents/        # Reusable UI primitives
│   ├── utils/               # Form validation utilities
│   ├── App.tsx              # Session bootstrap and authenticated app shell
│   └── main.tsx             # React entry point and providers
├── tests/                   # Standalone Playwright example outside the e2e config
├── package.json             # Dependencies and executable scripts
├── playwright.config.ts     # Browser-test configuration
├── Vitest.config.ts         # Unit-test and coverage configuration
└── vite.config.ts           # Vite, React, and Tailwind integration
```

Feature modules generally separate stateful `*Container.tsx` components from
render-focused `*Presenter.tsx` components. Domain-specific API calls live
outside those components under `src/services`.

## Screenshots

> **Dashboard placeholder** — add an admin dashboard image at
> `docs/screenshots/dashboard.png`.

> **Table ordering placeholder** — add a waiter ordering image at
> `docs/screenshots/table-ordering.png`.

> **Kitchen board placeholder** — add a KOT board image at
> `docs/screenshots/kitchen-board.png`.

> **QR ordering placeholder** — add a public QR menu image at
> `docs/screenshots/qr-ordering.png`.

## Installation

### Prerequisites

- Node.js LTS and npm.
- A compatible KOT POS backend reachable from the browser.

Create a local `.env` file from `.env.example`, then set `VITE_API_URL` to the
backend origin. Do not include `/api/v1`; the application adds that path for
REST requests.

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Vite serves the application at `http://localhost:5173` by default.

## Available Scripts

Every script below is defined in `package.json`.

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server with hot module replacement. |
| `npm run build` | Creates an optimized production build in `dist/`. |
| `npm run preview` | Serves the production build locally for inspection. |
| `npm test` | Starts Vitest in its default interactive/watch mode. |
| `npm run typecheck` | Runs the TypeScript project build in no-emit mode. |
| `npm run lint` | Runs ESLint across the repository. |
| `npm run e2e` | Runs the Playwright setup project and browser test suite. |
| `npm run e2e:ui` | Opens Playwright's interactive test UI. |
| `npm run e2e:debug` | Runs Playwright in debug mode. |
| `npm run e2e:report` | Opens the generated Playwright HTML report. |
| `npm run e2e:headed` | Runs Playwright with a visible browser window. |

For a one-time, non-watch unit-test run, pass Vitest's `--run` option:

```bash
npm test -- --run
```

## Environment Variables

The application and Playwright suite reference the following variables:

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | Recommended | Backend origin used by REST and Socket.IO clients, for example `http://localhost:3000`. |
| `E2E_ADMIN_USERNAME` | E2E only | Admin account used by Playwright authentication setup. |
| `E2E_ADMIN_PASSWORD` | E2E only | Password for the Playwright admin account. |
| `E2E_MANAGER_USERNAME` | E2E only | Manager account used by Playwright authentication setup. |
| `E2E_MANAGER_PASSWORD` | E2E only | Password for the Playwright manager account. |
| `E2E_WAITER_USERNAME` | E2E only | Waiter account used by Playwright authentication setup. |
| `E2E_WAITER_PASSWORD` | E2E only | Password for the Playwright waiter account. |
| `E2E_CASHIER_USERNAME` | E2E only | Cashier account used by Playwright authentication setup. |
| `E2E_CASHIER_PASSWORD` | E2E only | Password for the Playwright cashier account. |
| `E2E_CHEF_USERNAME` | E2E only | Chef account used by Playwright authentication setup. |
| `E2E_CHEF_PASSWORD` | E2E only | Password for the Playwright chef account. |

`VITE_API_URL` has code-level fallbacks, but setting it explicitly avoids the
different development and hosted defaults currently present in the API
modules.

Variables prefixed with `VITE_` are embedded in client code and must never
contain secrets. E2E credentials are read from `process.env`; the Playwright
configuration does not load `.env` automatically, so provide them in the
launching shell or the configured GitHub Actions secrets. Local `.env`,
`.env.production`, and Playwright authentication state are ignored by Git.

## Architecture

### Feature-Based Architecture

`src/features` groups UI and behavior by business capability and role:
administration, authentication, cashier, chef, waiter, and QR ordering. Larger
features use a container/presenter split so data loading and event handlers are
kept separate from rendering.

### API Layer

`src/services/apiClient.ts` creates the authenticated Axios client with an
`/api/v1` base path and `withCredentials: true`. Domain modules define typed
requests for admin, waiter, chef, cashier, authentication, and public QR APIs.
The public QR client intentionally uses a separate Axios instance without the
authenticated interceptor chain.

The response interceptor coordinates token refresh, queues concurrent failed
requests, retries rate-limited requests after the server-provided window, and
redirects to sign-in if refresh fails.

### State Management

Redux Toolkit owns cross-cutting client state. The configured store contains:

- `auth`: the current user, authentication state, and boot-time loading state.
- `cart`: table and cart reducers available for shared ordering state.
- `ui`: sidebar and toast reducers available for shared UI state.

Current feature screens keep most form, list, filter, and cart state locally
with React hooks. In practice, authentication is the primary Redux-backed flow;
the active ordering screens currently use their own local cart state.

### React Query

React Query is present in `package.json` but is not wired into `main.tsx` and is
not used by the feature modules. There is no `QueryClientProvider`, query cache,
or React Query mutation flow. Axios calls are coordinated with `useEffect`,
`useCallback`, local state, and explicit refresh functions.

### Redux Toolkit

The store uses `configureStore`, `createSlice`, typed dispatch and selector
hooks, and immutable reducer logic supplied by Redux Toolkit. Authentication
actions are dispatched after login, session validation, and logout.

### Protected Routes

`ProtectedRoute` requires an authenticated user and checks the route's allowed
roles from the centralized permission map. Unauthorized users are redirected
to their role home rather than shown a protected screen. `PublicRoute` keeps
authenticated users out of login, sign-in, sign-up, and public menu routes by
redirecting them to their role home.

### Authentication Flow

1. On boot, `App.tsx` requests `/auth/me` using the cookie session.
2. A valid response populates the Redux auth slice.
3. Sign-in posts credentials to `/auth/login`, stores only returned user
   metadata in Redux, and redirects by role.
4. Authenticated Axios requests include cookies automatically.
5. A qualifying `401` triggers one `/auth/refresh` request while other failed
   requests wait in a queue.
6. Logout calls `/auth/logout`, clears Redux credentials, disconnects
   notifications, and returns to `/login`.

## Security

- **Sanitized receipt printing:** Dynamic KOT and bill values are HTML-escaped.
  The GST receipt preview also passes generated markup through DOMPurify before
  rendering it with `dangerouslySetInnerHTML`.
- **Secure environment handling:** Local environment files and saved Playwright
  authentication state are gitignored. Browser-visible `VITE_` configuration is
  limited to the non-secret API origin; E2E credentials use runner environment
  variables and repository secrets.
- **Authentication improvements:** Cookies are sent with API requests, the app
  validates sessions on boot, token refreshes are deduplicated, retry loops are
  guarded, and protected routes enforce role access.
- **Safer service-worker behavior:** Non-GET requests are ignored and
  authenticated API responses are never written to Cache Storage. Only static
  assets use cache-first behavior.

Client-side route checks improve the user experience but do not replace
backend authorization. The API must independently validate every session,
role, resource, and state-changing request.

## Performance

- Route-level `React.lazy` and `Suspense` split authenticated feature bundles.
- Dashboard and report endpoints are fetched concurrently with `Promise.all`.
- Search input in order history is debounced before API requests.
- Memoized calculations and handlers are used in receipt generation and other
  expensive or frequently rendered paths.
- Socket events update kitchen and billing screens without full-page polling.
- The service worker caches static assets and uses a network-first navigation
  strategy while excluding API data.
- Vite produces hashed, minified production assets and separate lazy-route
  chunks.

## Testing

### Unit Tests

Vitest runs in jsdom with Testing Library and shared browser API mocks. The
current unit suites cover:

- Authentication reducer behavior.
- Cart reducer behavior.
- Route and feature permission helpers.
- Axios token-refresh decision logic.

Run the unit suite once:

```bash
npm test -- --run
```

### Integration and End-to-End Tests

Playwright specs under `e2e/` cover login, role redirects, route access,
waiter/chef/cashier/admin flows, and public QR ordering. A setup project logs in
as each role and stores browser state under `.auth/`.

The suite requires:

- A reachable, compatible, and seeded backend.
- All ten `E2E_*` username and password variables.
- Playwright browser binaries installed in the local environment.

Run it with:

```bash
npm run e2e
```

### Current Test Status

Status verified on July 29, 2026:

| Check | Result |
| --- | --- |
| `npm test -- --run` | Passed: 4 files, 122 tests |
| `npm run typecheck` | Passed |
| `npm run lint` | Passed |
| `npm run build` | Passed |
| `npm run e2e -- --list` | Not runnable locally: all required E2E credentials were unset |

The Playwright result above is an environment prerequisite failure, not a
successful browser-suite run.

## Production Readiness

| Area | Current state |
| --- | --- |
| TypeScript | Strict configuration; verified typecheck passes. |
| ESLint | Repository-wide lint script; verified lint passes. |
| Build | Verified Vite production build completes successfully. |
| Unit tests | 122 tests pass across 4 suites. |
| Browser tests | Auth, RBAC, operational, and QR specs exist; a credentialed seeded environment is required to validate them. |
| Automation | GitHub Actions runs Playwright for pushes and pull requests to `main` or `master`. |

The frontend is build-ready, but a complete release assessment must also
validate the external API, its authorization rules, production environment
configuration, and the credentialed Playwright suite.

## Future Improvements

- Add deterministic API mocks or disposable seeded test data so browser tests
  can run independently of shared backend state.
- Expand unit and integration coverage to feature containers, forms, printing,
  service-worker behavior, and Socket.IO event handling.
- Either adopt React Query with a shared query client and cache policy or remove
  the currently unused dependency.
- Add production error reporting, performance monitoring, and operational
  dashboards.
- Add privacy-aware product analytics and auditable administrative activity
  logs.
- Extend offline support only with an explicit queued-write and conflict
  resolution design; the current PWA intentionally does not cache API data.

## License

MIT. A standalone `LICENSE` file is not currently included in this repository.
