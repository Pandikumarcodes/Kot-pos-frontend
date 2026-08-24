# State Management

## Store composition

`src/state/index.ts` creates one Redux Toolkit store with three reducers:

```text
RootState
|-- auth
|   |-- user
|   |-- isAuthenticated
|   `-- isLoading
|-- cart
|   |-- tableId
|   |-- tableName
|   `-- items[]
`-- ui
    |-- sidebarOpen
    |-- selectedBranchId
    `-- toasts[]
```

`src/state/hooks.ts` exposes typed dispatch and selector hooks. Redux Toolkit supplies immutable update semantics; no custom middleware, persistence layer, or async thunk is configured.

## `auth` slice

The authentication slice is active cross-application state.

- `setCredentials(user)` stores the user, marks the session authenticated, and ends loading.
- `clearCredentials()` removes the user and ends loading.
- `setAuthLoading(boolean)` controls boot-time session checking.

The user model contains `id`, `name`, `email`, `role`, and nullable `branchId`. It does not contain a token. `App`, route guards, header/sidebar, login, and role redirects consume this slice.

## `cart` slice

The cart slice can associate a cart with a table and supports add/increment, remove, exact quantity, note, and clear actions. Adding the same `menuItemId` increments its quantity.

Current production ordering screens keep their active carts in component-local state rather than dispatching these reducers. The slice is covered by unit tests and remains part of the store, but it is not the source of truth for the waiter, cashier, or public QR cart flows.

## `ui` slice

The UI slice defines sidebar visibility, a selected branch ID, and a toast array, with reducers to toggle/set the sidebar, select a branch, and add/remove toasts.

Current runtime ownership is split:

- `ui.selectedBranchId` is used by the superadmin sidebar selector only and does not affect HTTP requests.
- `App.tsx` owns mobile sidebar open/closed state locally instead of using `ui.sidebarOpen`.
- Visible application toasts are managed by `ToastProvider` local context state and `globalToast`, not `ui.toasts`.

These distinctions are important when extending the store: the existence of a reducer does not mean the current screens consume it.

## Local feature state

Containers generally own:

- fetched entities and loading/error state;
- filters, search text, sorting, pagination, and active tabs;
- forms, modals, selected records, and mutation progress;
- waiter, cashier, and QR cart contents;
- abort controllers and refresh counters.

Derived data uses ordinary calculations plus selective `useMemo`/`useCallback`. Server data is not normalized or shared automatically between routes. A mutation usually updates local state or triggers a REST refetch.

## Context state

`ToastProvider` is the active notification state holder. It exposes success/error/warning/info methods, renders accessible toast statuses, and removes messages after 3.5 seconds. It also registers a module-level handler so the Axios interceptor can emit rate-limit messages without a React hook.

## Realtime interaction

Socket events do not dispatch Redux actions. `useNotifications` invokes the active page's handler; tables, kitchen, and bills then refetch their data. This keeps REST as the current screen's authoritative source at the cost of additional requests and no cross-route entity cache.

## Persistence and reset behavior

No Redux persistence is configured. A full reload resets `cart` and `ui` to their initial state, then `/auth/me` restores authentication from the backend cookie. Logout clears only the auth slice directly; component-local state disappears as protected screens unmount.
