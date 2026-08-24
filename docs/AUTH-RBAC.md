# Authentication and RBAC

## Authentication flow

The frontend uses a backend-managed cookie session:

1. On mount, `App.tsx` calls `GET /api/v1/auth/me` with credentials and `x-skip-refresh: true`.
2. A successful response stores user metadata in Redux. A failure clears it. The boot request is aborted after 60 seconds and shows a slow-start message after 5 seconds.
3. Sign-in posts username/password to `/auth/login`, maps the returned user to `{ id, name, email, role, branchId }`, and redirects to the role home.
4. Authenticated requests use `withCredentials: true`. No access token is stored in Redux or browser storage.
5. Eligible `401` responses cause one `/auth/refresh`; concurrent failed requests wait and are replayed after success.
6. Refresh failure redirects to `/login`. Logout calls `/auth/logout`, clears Redux even if that call fails, and disconnects Socket.IO through the authentication state change.

The `rememberMe` control is local sign-in UI state; current submission logic does not send or persist it. The forgot-password control opens a modal but no recovery API call is implemented in the container.

## Roles are explicit, not inherited

The recognized roles are:

`superadmin`, `admin`, `manager`, `waiter`, `chef`, and `cashier`.

These labels do **not** form a permission inheritance tree. In particular:

> **Superadmin != Branch Admin.** `superadmin` can open global branch management and lands at `/admin/branches`. It is deliberately excluded from branch-operational routes and feature permissions. `admin` operates within a branch and cannot open global branch management.

## Route permission matrix

This matrix reflects `ROUTE_PERMISSIONS` and the actual grouping in `AppRouter`.

| Route or route group | superadmin | admin | manager | waiter | chef | cashier |
| --- | :---: | :---: | :---: | :---: | :---: | :---: |
| `/admin/branches` | Yes | No | No | No | No | No |
| `/admin/dashboard` | No | Yes | Yes | No | No | No |
| `/admin/menu` | No | Yes | Yes | No | No | No |
| `/admin/inventory` | No | Yes | Yes | No | No | No |
| `/admin/customers` | No | Yes | Yes | No | No | No |
| `/admin/reports` | No | Yes | Yes | No | No | No |
| `/admin/ai` | No | Yes | Yes | No | No | No |
| `/admin/tables` | No | Yes | Yes | No | No | No |
| `/admin/staff` | No | Yes | No | No | No | No |
| `/admin/settings` | No | Yes | No | No | No | No |
| `/waiter/tables`, `/waiter/orders`, `/waiter/order/:tableId` | No | Yes | Yes | Yes | No | No |
| `/chef/kot` | No | Yes | No | No | Yes | No |
| `/cashier/billing` | No | Yes | No | No | No | Yes |

Public-route group: `/login`, `/signin`, `/signup`, and `/menu/:tableId` are available only while unauthenticated because `PublicRoute` redirects authenticated users to their role home.

## Role home pages

| Role | Home |
| --- | --- |
| `superadmin` | `/admin/branches` |
| `admin` | `/admin/dashboard` |
| `manager` | `/admin/dashboard` |
| `waiter` | `/waiter/tables` |
| `chef` | `/chef/kot` |
| `cashier` | `/cashier/billing` |

## Feature-action permission matrix

These checks control selected frontend actions through `FEATURE_PERMISSIONS`; a blank cell means the role is not listed.

| Action | superadmin | admin | manager | waiter | chef | cashier |
| --- | :---: | :---: | :---: | :---: | :---: | :---: |
| Add table |  | Yes |  |  |  |  |
| Delete table |  | Yes |  |  |  |  |
| Edit menu |  | Yes | Yes |  |  |  |
| Delete menu |  | Yes |  |  |  |  |
| Add staff |  | Yes |  |  |  |  |
| Delete staff |  | Yes |  |  |  |  |
| View reports |  | Yes | Yes |  |  |  |
| Allocate table |  | Yes | Yes | Yes |  |  |
| Send to kitchen |  | Yes | Yes | Yes |  |  |
| Process billing |  | Yes |  |  |  | Yes |
| View KOT |  | Yes |  |  | Yes |  |

Route access and action visibility are separate. For example, managers can open table screens but `canAddTable` and `canDeleteTable` are admin-only.

## Sidebar visibility

Navigation uses a third centralized mapping, `NAV_PERMISSIONS`. It mostly mirrors routes, but only links declared in `Sidebar.tsx` appear. The Orders link is currently commented out even though `/waiter/orders` is routed. The sidebar's Tables link targets `/waiter/tables`; `/admin/tables` remains a valid direct route for admin and manager.

## Branch isolation

- The authenticated `AuthUser` includes `branchId: string | null`.
- Branch roles display their assigned branch label when it can be resolved.
- Operational API functions do not attach `branchId` from Redux as a query parameter or header.
- `apiClient.ts` contains an exported operational-route classifier, but the request interceptor currently returns the Axios config unchanged.
- A superadmin can select an active branch in the sidebar, which updates `ui.selectedBranchId` and a label only. That selection is not propagated to API requests.
- Socket.IO joins a role room; the frontend does not emit a branch identifier.

Therefore the frontend relies on the backend session to enforce operational branch isolation. This repository cannot verify the backend enforcement itself.

## Security boundary

Frontend redirects and hidden buttons improve navigation and reduce accidental access. They do not authorize data. A compatible backend must independently validate the cookie session, role, branch assignment, resource ownership, and every state-changing operation.
