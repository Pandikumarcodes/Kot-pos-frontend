# Kitchen backend contract

Reviewed from the read-only backend implementation for Sprint F1 Phase 9.

## `GET /api/v1/chef/kot`

The endpoint returns `{ KotOrders, pagination }`. Query controls are:

- `page`: positive integer, default `1`.
- `limit`: positive integer, default `20`, capped at `100`.
- `status`: `pending`, `preparing`, or `ready`.
- `sort`: `createdAt` or `status`.
- `order`: `asc` or `desc`.

The endpoint always applies the active kitchen constraint (`pending`,
`preparing`, `ready`). The KOT model also defines `served` and `cancelled`, but
those values are not valid list/filter results for this kitchen endpoint.

Pagination metadata is `{ page, limit, total, pages, hasNext, hasPrev }`.

The existing realtime events are unchanged:

- `order:new` carries a newly created KOT.
- `kot:updated` carries the updated KOT after a kitchen status action.

The frontend changes send only the supported query parameters and retain the
existing socket subscription and action endpoints.
