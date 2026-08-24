# API Integration

## Clients and base URLs

The shared client in `src/services/apiClient.ts` is an Axios instance with:

- base URL `${VITE_API_URL}/api/v1`;
- `withCredentials: true` for cookie-based authentication;
- a response interceptor for rate limits and session refresh.

If `VITE_API_URL` is unset, this client and the public QR client fall back to the hosted backend origin currently encoded in their modules. `src/config/apiEndpoints.ts`, used by the direct signup request, instead falls back to `http://localhost:3000`. Setting `VITE_API_URL` avoids that fallback inconsistency.

The value must be an origin without `/api/v1`. Because it is a Vite variable, it is public build-time configuration and must not contain a secret.

## Service organization

- `services/admin/*`: dashboard, branches, customers, inventory, menu, reports, settings, and staff.
- `services/waiter/*`: tables, allocation, orders, KOT submission, served/cancelled status, and billing handoff.
- `services/chef/*`: KOT queries and start/ready/cancel transitions.
- `services/cashier/*`: takeaway orders, billing, settlement, deletion, and income.
- `services/qrMenu.api.ts`: public menu, order placement, and order status.
- `services/settings.api.ts`: receipt settings used by printing.

These modules provide TypeScript request/response shapes around Axios calls. They do not generate a client from an OpenAPI schema, validate response bodies at runtime, or cache responses globally.

## Auth handling

The browser owns the session cookie. The frontend does not set an `Authorization` header or persist a token.

On `401`, the interceptor attempts refresh only when all of these are true:

- this is the first retry;
- the browser is not on `/login`, `/signin`, or `/signup`;
- the request lacks `x-skip-refresh`;
- the failed request is not `/auth/refresh` itself.

Only one refresh runs at a time. Concurrent `401` requests wait in a queue, then retry after refresh succeeds. If refresh fails, queued requests reject and the browser navigates to `/login`. The `/auth/me` startup call opts out of refresh explicitly.

The public QR client is a separate plain Axios instance without `withCredentials` or the authenticated interceptor chain. Signup also performs a direct credentialed Axios call rather than using the shared client.

## Error behavior

### Rate limiting

For `429` responses, the interceptor reads `data.retryAfter`, then the `Retry-After` header, then defaults to 10 seconds. It shows one warning toast per active window, queues affected requests, and retries them when the timer expires. A second informational toast is shown before the queue flushes.

### Other errors

- `500` responses are logged to the console by the interceptor and remain rejected.
- Other statuses pass through as rejected Axios errors.
- Feature containers usually prefer `response.data.error` and fall back to screen-specific messages.
- Paginated containers often use `AbortController` to cancel superseded work.
- There is no common response-envelope transform, retry policy for general network errors, or external telemetry.

## Branch context

Operational requests do **not** receive a branch ID from the frontend. The shared request interceptor returns configuration unchanged, even though `isOperationalBranchRequest()` can classify path prefixes that the backend treats as operational.

Consequences visible in this codebase:

- `auth.user.branchId` is stored for identity/display.
- `ui.selectedBranchId` is a superadmin sidebar selection only.
- Domain services send their declared filters and pagination, with no injected `branchId` header or parameter.
- Global branch administration calls `/admin/branches...` explicitly by branch resource ID.

The frontend therefore relies on the authenticated backend session for branch isolation. Selecting a branch as superadmin does not change operational request scope, and superadmin is not permitted to open operational routes.

## Query and response conventions

List services pass explicit query objects through Axios `params`; several preserve the no-argument form to avoid adding an empty params object. Containers verify required pagination metadata in important list responses and handle backend-specific empty results where implemented. Endpoint naming is not fully uniform (`menuItems`, `menu-item`, `deleteUser`, and REST-style resources coexist), so the domain service layer is the stable import boundary for UI code.

## Public QR flow

The public route performs:

1. `GET /public/menu/:tableId`
2. `POST /public/order/:tableId`
3. `GET /public/order/:orderId/status` immediately after confirmation and every 10 seconds while the confirmation step remains mounted.

Status polling errors are intentionally ignored by the current container.
