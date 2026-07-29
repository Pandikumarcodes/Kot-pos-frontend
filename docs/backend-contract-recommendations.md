# Backend contract recommendations

This note covers Phase 3 findings that cannot be fully solved by frontend code
without changing server-side authorization or transaction behavior.

## Atomic and idempotent order submission

### Current risk

The waiter and cashier workflows create an order and send it to the kitchen in
separate requests. If creation succeeds and the second request fails, retrying
from the UI can create a duplicate order. The frontend cannot guarantee
atomicity across two independent server mutations.

### Recommended contract

Provide one transactional command per workflow:

- `POST /api/v1/waiter/orders/submit`
- `POST /api/v1/cashier/takeaway-orders/submit`

Each command should:

1. Validate the table, branch, menu items, quantities, prices, and caller role.
2. Create the order and its initial kitchen state in one database transaction.
3. Accept an `Idempotency-Key` header and return the original result when the
   same key and payload are retried.
4. Return `201` with `{ message, order }`, including a stable `order._id`.
5. Return `409` when the same key is reused with a different payload.

The server should emit realtime events only after the transaction commits.

### Frontend preparation

Order mutations are already centralized in service modules and both current
create endpoints return an order ID. Once the transactional endpoints and CORS
allow-list for `Idempotency-Key` are available, the service functions can be
swapped without redesigning presenters or page navigation. The frontend should
generate one key per user submission and retain it until a definitive response.

No idempotency header is sent yet because doing so before backend and CORS
support would change the deployed API contract.

## Signup authorization

### Current risk

The public signup form submits a caller-selected `role` and `status`, including
`admin` and `manager`. Frontend restrictions cannot enforce authorization
because a caller can invoke the endpoint directly.

### Recommended contract

`POST /api/v1/auth/signup` should either:

- create only the lowest-privilege role supported for public registration,
  ignoring `role` and `status`; or
- be removed from public access and require an authenticated admin with an
  explicit staff-management permission.

Privileged staff creation should remain under
`POST /api/v1/admin/create-user`. The backend must validate an allow-list of
assignable roles and prevent branch administrators from creating users outside
their branch or privilege ceiling.

### Frontend preparation

The existing authenticated staff-management page already uses the admin
endpoint. After the backend confirms the intended public-signup policy, the
public role selector and authorization-sensitive fields can be removed without
changing staff management. They remain unchanged in this phase because the
requested scope excludes redesigning signup behavior.
