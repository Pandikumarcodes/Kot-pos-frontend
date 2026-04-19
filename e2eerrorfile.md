PS C:\Users\Pandikumar\Desktop\Kot-Pos\kot-pos-frontend> npx playwright test
[WebServer]
[WebServer] > kot-pos-frontend@0.0.0 dev
[WebServer] > vite
[WebServer]
[WebServer]
[WebServer] ROLLDOWN-VITE v7.2.5 ready in 1351 ms
[WebServer]
[WebServer] ➜ Local: http://localhost:5173/
[WebServer] ➜ Network: use --host to expose

Running 71 tests using 4 workers

✓ 1 [setup] › e2e\setup\Auth.setup.ts:140:1 › authenticate as admin (6.3s)

[auth.setup] Logging in as: admin
[auth.setup] ✓ admin landed on: http://localhost:5173/admin/dashboard
[auth.setup] ✓ Auth cookie: "refreshToken" for admin
[auth.setup] ✓ Saved: .auth/admin.json
✓ 2 [setup] › e2e\setup\Auth.setup.ts:144:1 › authenticate as manager (1.4s)

[auth.setup] Logging in as: manager
[auth.setup] ✓ manager landed on: http://localhost:5173/admin/dashboard
[auth.setup] ✓ Auth cookie: "refreshToken" for manager
[auth.setup] ✓ Saved: .auth/manager.json
✓ 3 [setup] › e2e\setup\Auth.setup.ts:148:1 › authenticate as waiter (2.0s)

[auth.setup] Logging in as: waiter
[auth.setup] ✓ waiter landed on: http://localhost:5173/waiter/tables
[auth.setup] ✓ Auth cookie: "refreshToken" for waiter
[auth.setup] ✓ Saved: .auth/waiter.json
✓ 4 [setup] › e2e\setup\Auth.setup.ts:152:1 › authenticate as cashier (2.6s)

[auth.setup] Logging in as: cashier
[auth.setup] ✓ cashier landed on: http://localhost:5173/cashier/billing
[auth.setup] ✓ Auth cookie: "refreshToken" for cashier
[auth.setup] ✓ Saved: .auth/cashier.json
✓ 5 [setup] › e2e\setup\Auth.setup.ts:156:1 › authenticate as chef (2.1s)

[auth.setup] Logging in as: chef
[auth.setup] ✓ chef landed on: http://localhost:5173/chef/kot
[auth.setup] ✓ Auth cookie: "refreshToken" for chef
[auth.setup] ✓ Saved: .auth/chef.json
✓ 6 [chromium] › e2e\auth\Login.spec.ts:9:3 › Login landing page › shows Sign In and Create Account cards (2.8s)
✓ 7 [chromium] › e2e\auth\Login.spec.ts:14:3 › Login landing page › clicking Sign In navigates to /signin (3.3s)
✓ 8 [chromium] › e2e\auth\Login.spec.ts:20:3 › Login landing page › clicking Create Account navigates to signup (3.1s)
✓ 9 [chromium] › e2e\auth\Login.spec.ts:35:3 › Sign In form › shows username and password fields (3.0s)
✘ 10 [chromium] › e2e\auth\Login.spec.ts:41:3 › Sign In form › shows error on wrong password (7.7s)
✘ 11 [chromium] › e2e\auth\Login.spec.ts:51:3 › Sign In form › shows error on non-existent username (8.4s)
✓ 12 [chromium] › e2e\auth\Login.spec.ts:61:3 › Sign In form › shows loading state while signing in (2.6s)
✓ 13 [chromium] › e2e\auth\Login.spec.ts:72:3 › Sign In form › Back button returns to /login (2.7s)
✓ 14 [chromium] › e2e\auth\Login.spec.ts:78:3 › Sign In form › toggle password visibility works (1.8s)
✘ 15 [chromium] › e2e\auth\Login.spec.ts:101:3 › Sign In form › admin lands on /admin/dashboard after login (16.7s)
✘ 16 [chromium] › e2e\auth\Login.spec.ts:110:3 › Sign In form › waiter lands on /waiter/tables after login (16.6s)
✘ 17 [chromium] › e2e\auth\Login.spec.ts:119:3 › Sign In form › chef lands on /chef/kot after login (17.1s)
✘ 18 [chromium] › e2e\auth\Login.spec.ts:128:3 › Sign In form › cashier lands on /cashier/billing after login (17.1s)
✘ 19 [chromium] › e2e\auth\Login.spec.ts:140:3 › Logout › logout clears session and redirects to login (16.2s)
✓ 20 [chromium] › e2e\auth\Rbac.spec.ts:8:3 › Admin role access › can access /admin/dashboard (1.2s)
✘ 21 [chromium] › e2e\auth\Rbac.spec.ts:15:3 › Admin role access › can access /admin/menu (6.1s)
✘ 22 [chromium] › e2e\auth\Rbac.spec.ts:21:3 › Admin role access › can access /admin/staff (6.0s)
✘ 23 [chromium] › e2e\auth\Rbac.spec.ts:27:3 › Admin role access › can access /admin/reports (6.1s)
✘ 24 [chromium] › e2e\auth\Rbac.spec.ts:33:3 › Admin role access › can access /admin/settings (5.8s)
✓ 25 [chromium] › e2e\auth\Rbac.spec.ts:44:3 › Manager role access › can access /admin/dashboard (1.9s)
✘ 26 [chromium] › e2e\auth\Rbac.spec.ts:51:3 › Manager role access › can access /admin/menu (6.4s)
✓ 27 [chromium] › e2e\auth\Rbac.spec.ts:73:3 › Manager role access › is redirected away from /admin/settings (959ms)
✓ 28 [chromium] › e2e\auth\Rbac.spec.ts:82:3 › Manager role access › is redirected away from /chef/kot (842ms)
✘ 29 [chromium] › e2e\auth\Rbac.spec.ts:57:3 › Manager role access › can access /admin/reports (6.4s)
✓ 30 [chromium] › e2e\auth\Rbac.spec.ts:91:3 › Manager role access › is redirected away from /cashier/billing (1.2s)
✓ 31 [chromium] › e2e\auth\Rbac.spec.ts:105:3 › Waiter role access › can access /waiter/tables (1.4s)
✓ 32 [chromium] › e2e\auth\Rbac.spec.ts:63:3 › Manager role access › is redirected away from /admin/staff (1.5s)
✓ 33 [chromium] › e2e\auth\Rbac.spec.ts:112:3 › Waiter role access › is redirected away from /admin/dashboard (1.1s)
✓ 34 [chromium] › e2e\auth\Rbac.spec.ts:130:3 › Waiter role access › is redirected away from /cashier/billing (1.2s)
✓ 35 [chromium] › e2e\auth\Rbac.spec.ts:139:3 › Waiter role access › is redirected away from /chef/kot (1.1s)
✓ 36 [chromium] › e2e\auth\Rbac.spec.ts:153:3 › Chef role access › can access /chef/kot (1.3s)
✓ 37 [chromium] › e2e\auth\Rbac.spec.ts:160:3 › Chef role access › is redirected away from /admin/dashboard (1.2s)
✓ 38 [chromium] › e2e\auth\Rbac.spec.ts:169:3 › Chef role access › is redirected away from /waiter/tables (1.4s)
✓ 39 [chromium] › e2e\auth\Rbac.spec.ts:178:3 › Chef role access › is redirected away from /cashier/billing (1.5s)
✓ 40 [chromium] › e2e\auth\Rbac.spec.ts:192:3 › Cashier role access › can access /cashier/billing (1.7s)
✓ 41 [chromium] › e2e\auth\Rbac.spec.ts:121:3 › Waiter role access › is redirected away from /admin/staff (12.3s)
✓ 42 [chromium] › e2e\auth\Rbac.spec.ts:199:3 › Cashier role access › is redirected away from /admin/dashboard (1.5s)
✓ 43 [chromium] › e2e\auth\Rbac.spec.ts:217:3 › Cashier role access › is redirected away from /admin/staff (1.3s)
✓ 44 [chromium] › e2e\auth\Rbac.spec.ts:231:3 › Unauthenticated access › redirects /admin/dashboard to login (1.3s)
✓ 45 [chromium] › e2e\auth\Rbac.spec.ts:237:3 › Unauthenticated access › redirects /waiter/tables to login (1.3s)
✓ 46 [chromium] › e2e\auth\Rbac.spec.ts:243:3 › Unauthenticated access › redirects /chef/kot to login (1.3s)
✓ 47 [chromium] › e2e\auth\Rbac.spec.ts:249:3 › Unauthenticated access › redirects /cashier/billing to login (1.6s)  
 ✓ 48 [chromium] › e2e\auth\Rbac.spec.ts:255:3 › Unauthenticated access › allows access to public QR menu route (1.4s)
✓ 49 [chromium] › e2e\flows\Order.spec.ts:10:3 › Waiter — table allocation and order › waiter can see tables page (1.7s)

- 50 [chromium] › e2e\flows\Order.spec.ts:20:3 › Waiter — table allocation and order › waiter can allocate an available table  
  ✓ 51 [chromium] › e2e\auth\Rbac.spec.ts:208:3 › Cashier role access › is redirected away from /chef/kot (8.1s)
- 52 [chromium] › e2e\flows\Order.spec.ts:50:3 › Waiter — table allocation and order › waiter can navigate to order page
  ✓ 53 [chromium] › e2e\flows\Order.spec.ts:77:3 › Chef — Kitchen display › chef can see KOT page (1.6s)
  ✘ 54 [chromium] › e2e\flows\Order.spec.ts:86:3 › Chef — Kitchen display › chef sees pending orders on KOT (966ms)
- 55 [chromium] › e2e\flows\Order.spec.ts:108:3 › Chef — Kitchen display › chef can mark an order as preparing
  ✓ 56 [chromium] › e2e\flows\Order.spec.ts:156:3 › Cashier — billing › cashier can see billing page (883ms)
  ✘ 57 [chromium] › e2e\flows\Order.spec.ts:164:3 › Cashier — billing › cashier can see list of bills (926ms)
  ✓ 58 [chromium] › e2e\flows\Order.spec.ts:219:3 › Admin — dashboard › admin can see dashboard with stats (2.8s)
- 59 [chromium] › e2e\flows\Order.spec.ts:127:3 › Chef — Kitchen display › chef can mark an order as ready
  ✘ 60 [chromium] › e2e\flows\Order.spec.ts:234:3 › Admin — dashboard › admin can navigate to staff page (6.1s)
- 61 [chromium] › e2e\flows\Order.spec.ts:183:3 › Cashier — billing › cashier can mark a bill as paid
  ✘ 62 [chromium] › e2e\flows\Order.spec.ts:226:3 › Admin — dashboard › admin can navigate to menu management (6.2s)
  ✘ 63 [chromium] › e2e\flows\Order.spec.ts:241:3 › Admin — dashboard › admin can navigate to reports (6.0s)
  ✓ 64 [chromium] › e2e\flows\Qr.spec.ts:10:3 › QR Code — public ordering flow › QR menu page loads without login (2.7s)
  ✓ 65 [chromium] › e2e\flows\Order.spec.ts:248:3 › Admin — dashboard › admin sidebar shows all nav items (2.7s)
  ✘ 66 [chromium] › e2e\flows\Qr.spec.ts:18:3 › QR Code — public ordering flow › QR menu shows restaurant name and menu items (2.2s)
  ✓ 67 [chromium] › e2e\flows\Qr.spec.ts:35:3 › QR Code — public ordering flow › customer can browse menu categories (3.1s)
- 68 [chromium] › e2e\flows\Qr.spec.ts:69:3 › QR Code — public ordering flow › customer can add item to cart
- 69 [chromium] › e2e\flows\Qr.spec.ts:94:3 › QR Code — public ordering flow › customer can place an order
- 70 [chromium] › e2e\flows\Qr.spec.ts:118:8 › QR Code — public ordering flow › customer can check order status  
  ✘ 71 [chromium] › e2e\flows\Qr.spec.ts:120:3 › QR Code — public ordering flow › shows 404 for non-existent table (3.8s)

1. [chromium] › e2e\auth\Login.spec.ts:41:3 › Sign In form › shows error on wrong password ───────


    Error: expect(locator).toBeVisible() failed

    Locator: getByText(/invalid credentials/i)
    Expected: visible
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
      - Expect "toBeVisible" with timeout 5000ms
      - waiting for getByText(/invalid credentials/i)


      44 |     await page.getByRole("button", { name: "Sign In" }).click();
      45 |
    > 46 |     await expect(page.getByText(/invalid credentials/i)).toBeVisible({
         |                                                          ^
      47 |       timeout: 5_000,
      48 |     });
      49 |   });
        at C:\Users\Pandikumar\Desktop\Kot-Pos\kot-pos-frontend\e2e\auth\Login.spec.ts:46:58

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results\auth-Login-Sign-In-form-shows-error-on-wrong-password-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results\auth-Login-Sign-In-form-shows-error-on-wrong-password-chromium\error-context.md

2. [chromium] › e2e\auth\Login.spec.ts:51:3 › Sign In form › shows error on non-existent username


    Error: expect(locator).toBeVisible() failed

    Locator: getByText(/invalid credentials/i)
    Expected: visible
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
      - Expect "toBeVisible" with timeout 5000ms
      - waiting for getByText(/invalid credentials/i)


      54 |     await page.getByRole("button", { name: "Sign In" }).click();
      55 |
    > 56 |     await expect(page.getByText(/invalid credentials/i)).toBeVisible({
         |                                                          ^
      57 |       timeout: 5_000,
      58 |     });
      59 |   });
        at C:\Users\Pandikumar\Desktop\Kot-Pos\kot-pos-frontend\e2e\auth\Login.spec.ts:56:58

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results\auth-Login-Sign-In-form-shows-error-on-non-existent-username-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results\auth-Login-Sign-In-form-shows-error-on-non-existent-username-chromium\error-context.md

3. [chromium] › e2e\auth\Login.spec.ts:101:3 › Sign In form › admin lands on /admin/dashboard after login


    TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
    =========================== logs ===========================
    waiting for navigation to "**/admin/dashboard" until "load"
    ============================================================

      104 |     await page.getByRole("button", { name: "Sign In" }).click();
      105 |
    > 106 |     await page.waitForURL("**/admin/dashboard", { timeout: 15_000 });
          |                ^
      107 |     expect(page.url()).toContain("/admin/dashboard");
      108 |   });
      109 |
        at C:\Users\Pandikumar\Desktop\Kot-Pos\kot-pos-frontend\e2e\auth\Login.spec.ts:106:16

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results\auth-Login-Sign-In-form-ad-0a503-admin-dashboard-after-login-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results\auth-Login-Sign-In-form-ad-0a503-admin-dashboard-after-login-chromium\error-context.md

4. [chromium] › e2e\auth\Login.spec.ts:110:3 › Sign In form › waiter lands on /waiter/tables after login


    TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
    =========================== logs ===========================
    waiting for navigation to "**/waiter/tables" until "load"
    ============================================================

      113 |     await page.getByRole("button", { name: "Sign In" }).click();
      114 |
    > 115 |     await page.waitForURL("**/waiter/tables", { timeout: 15_000 });
          |                ^
      116 |     expect(page.url()).toContain("/waiter/tables");
      117 |   });
      118 |
        at C:\Users\Pandikumar\Desktop\Kot-Pos\kot-pos-frontend\e2e\auth\Login.spec.ts:115:16

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results\auth-Login-Sign-In-form-wa-39e08-n-waiter-tables-after-login-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results\auth-Login-Sign-In-form-wa-39e08-n-waiter-tables-after-login-chromium\error-context.md

5. [chromium] › e2e\auth\Login.spec.ts:119:3 › Sign In form › chef lands on /chef/kot after login


    TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
    =========================== logs ===========================
    waiting for navigation to "**/chef/kot" until "load"
    ============================================================

      122 |     await page.getByRole("button", { name: "Sign In" }).click();
      123 |
    > 124 |     await page.waitForURL("**/chef/kot", { timeout: 15_000 });
          |                ^
      125 |     expect(page.url()).toContain("/chef/kot");
      126 |   });
      127 |
        at C:\Users\Pandikumar\Desktop\Kot-Pos\kot-pos-frontend\e2e\auth\Login.spec.ts:124:16

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results\auth-Login-Sign-In-form-chef-lands-on-chef-kot-after-login-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results\auth-Login-Sign-In-form-chef-lands-on-chef-kot-after-login-chromium\error-context.md

6. [chromium] › e2e\auth\Login.spec.ts:128:3 › Sign In form › cashier lands on /cashier/billing after login


    TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
    =========================== logs ===========================
    waiting for navigation to "**/cashier/billing" until "load"
    ============================================================

      131 |     await page.getByRole("button", { name: "Sign In" }).click();
      132 |
    > 133 |     await page.waitForURL("**/cashier/billing", { timeout: 15_000 });
          |                ^
      134 |     expect(page.url()).toContain("/cashier/billing");
      135 |   });
      136 | });
        at C:\Users\Pandikumar\Desktop\Kot-Pos\kot-pos-frontend\e2e\auth\Login.spec.ts:133:16

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results\auth-Login-Sign-In-form-ca-c8959-cashier-billing-after-login-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results\auth-Login-Sign-In-form-ca-c8959-cashier-billing-after-login-chromium\error-context.md

7. [chromium] › e2e\auth\Login.spec.ts:140:3 › Logout › logout clears session and redirects to login


    TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
    =========================== logs ===========================
    waiting for navigation to "**/admin/dashboard" until "load"
    ============================================================

      147 |     await page.getByPlaceholder("••••••••").fill("Admin@1234");
      148 |     await page.getByRole("button", { name: "Sign In" }).click();
    > 149 |     await page.waitForURL("**/admin/dashboard", { timeout: 15_000 });
          |                ^
      150 |
      151 |     // Step 2 — Click logout
      152 |     // Try sidebar button first, then any visible logout trigger
        at C:\Users\Pandikumar\Desktop\Kot-Pos\kot-pos-frontend\e2e\auth\Login.spec.ts:149:16

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results\auth-Login-Logout-logout-c-81507-sion-and-redirects-to-login-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results\auth-Login-Logout-logout-c-81507-sion-and-redirects-to-login-chromium\error-context.md

8. [chromium] › e2e\auth\Rbac.spec.ts:15:3 › Admin role access › can access /admin/menu ──────────


    Error: expect(page).toHaveURL(expected) failed

    Expected pattern: /.*\/admin\/menu/
    Received string:  "http://localhost:5173/admin/dashboard"
    Timeout: 5000ms

    Call log:
      - Expect "toHaveURL" with timeout 5000ms
        8 × unexpected value "http://localhost:5173/admin/dashboard"


      16 |     await page.goto("/admin/menu");
      17 |     await page.waitForURL(/.*\/admin\/menu/, { timeout: 10_000 });
    > 18 |     await expect(page).toHaveURL(/.*\/admin\/menu/);
         |                        ^
      19 |   });
      20 |
      21 |   test("can access /admin/staff", async ({ page }) => {
        at C:\Users\Pandikumar\Desktop\Kot-Pos\kot-pos-frontend\e2e\auth\Rbac.spec.ts:18:24

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results\auth-Rbac-Admin-role-access-can-access-admin-menu-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results\auth-Rbac-Admin-role-access-can-access-admin-menu-chromium\error-context.md

9. [chromium] › e2e\auth\Rbac.spec.ts:21:3 › Admin role access › can access /admin/staff ─────────


    Error: expect(page).toHaveURL(expected) failed

    Expected pattern: /.*\/admin\/staff/
    Received string:  "http://localhost:5173/admin/dashboard"
    Timeout: 5000ms

    Call log:
      - Expect "toHaveURL" with timeout 5000ms
        2 × unexpected value "http://localhost:5173/login"
        6 × unexpected value "http://localhost:5173/admin/dashboard"


      22 |     await page.goto("/admin/staff");
      23 |     await page.waitForURL(/.*\/admin\/staff/, { timeout: 10_000 });
    > 24 |     await expect(page).toHaveURL(/.*\/admin\/staff/);
         |                        ^
      25 |   });
      26 |
      27 |   test("can access /admin/reports", async ({ page }) => {
        at C:\Users\Pandikumar\Desktop\Kot-Pos\kot-pos-frontend\e2e\auth\Rbac.spec.ts:24:24

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results\auth-Rbac-Admin-role-access-can-access-admin-staff-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results\auth-Rbac-Admin-role-access-can-access-admin-staff-chromium\error-context.md

10. [chromium] › e2e\auth\Rbac.spec.ts:27:3 › Admin role access › can access /admin/reports ──────


    Error: expect(page).toHaveURL(expected) failed

    Expected pattern: /.*\/admin\/reports/
    Received string:  "http://localhost:5173/admin/dashboard"
    Timeout: 5000ms

    Call log:
      - Expect "toHaveURL" with timeout 5000ms
        2 × unexpected value "http://localhost:5173/login"
        6 × unexpected value "http://localhost:5173/admin/dashboard"


      28 |     await page.goto("/admin/reports");
      29 |     await page.waitForURL(/.*\/admin\/reports/, { timeout: 10_000 });
    > 30 |     await expect(page).toHaveURL(/.*\/admin\/reports/);
         |                        ^
      31 |   });
      32 |
      33 |   test("can access /admin/settings", async ({ page }) => {
        at C:\Users\Pandikumar\Desktop\Kot-Pos\kot-pos-frontend\e2e\auth\Rbac.spec.ts:30:24

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results\auth-Rbac-Admin-role-access-can-access-admin-reports-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results\auth-Rbac-Admin-role-access-can-access-admin-reports-chromium\error-context.md

11. [chromium] › e2e\auth\Rbac.spec.ts:33:3 › Admin role access › can access /admin/settings ─────


    Error: expect(page).toHaveURL(expected) failed

    Expected pattern: /.*\/admin\/settings/
    Received string:  "http://localhost:5173/admin/dashboard"
    Timeout: 5000ms

    Call log:
      - Expect "toHaveURL" with timeout 5000ms
        2 × unexpected value "http://localhost:5173/login"
        6 × unexpected value "http://localhost:5173/admin/dashboard"


      34 |     await page.goto("/admin/settings");
      35 |     await page.waitForURL(/.*\/admin\/settings/, { timeout: 10_000 });
    > 36 |     await expect(page).toHaveURL(/.*\/admin\/settings/);
         |                        ^
      37 |   });
      38 | });
      39 |
        at C:\Users\Pandikumar\Desktop\Kot-Pos\kot-pos-frontend\e2e\auth\Rbac.spec.ts:36:24

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results\auth-Rbac-Admin-role-access-can-access-admin-settings-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results\auth-Rbac-Admin-role-access-can-access-admin-settings-chromium\error-context.md

12. [chromium] › e2e\auth\Rbac.spec.ts:51:3 › Manager role access › can access /admin/menu ───────


    Error: expect(page).toHaveURL(expected) failed

    Expected pattern: /.*\/admin\/menu/
    Received string:  "http://localhost:5173/admin/dashboard"
    Timeout: 5000ms

    Call log:
      - Expect "toHaveURL" with timeout 5000ms
        2 × unexpected value "http://localhost:5173/login"
        6 × unexpected value "http://localhost:5173/admin/dashboard"


      52 |     await page.goto("/admin/menu");
      53 |     await page.waitForURL(/.*\/admin\/menu/, { timeout: 10_000 });
    > 54 |     await expect(page).toHaveURL(/.*\/admin\/menu/);
         |                        ^
      55 |   });
      56 |
      57 |   test("can access /admin/reports", async ({ page }) => {
        at C:\Users\Pandikumar\Desktop\Kot-Pos\kot-pos-frontend\e2e\auth\Rbac.spec.ts:54:24

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results\auth-Rbac-Manager-role-access-can-access-admin-menu-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results\auth-Rbac-Manager-role-access-can-access-admin-menu-chromium\error-context.md

13. [chromium] › e2e\auth\Rbac.spec.ts:57:3 › Manager role access › can access /admin/reports ────


    Error: expect(page).toHaveURL(expected) failed

    Expected pattern: /.*\/admin\/reports/
    Received string:  "http://localhost:5173/admin/dashboard"
    Timeout: 5000ms

    Call log:
      - Expect "toHaveURL" with timeout 5000ms
        2 × unexpected value "http://localhost:5173/login"
        6 × unexpected value "http://localhost:5173/admin/dashboard"


      58 |     await page.goto("/admin/reports");
      59 |     await page.waitForURL(/.*\/admin\/reports/, { timeout: 10_000 });
    > 60 |     await expect(page).toHaveURL(/.*\/admin\/reports/);
         |                        ^
      61 |   });
      62 |
      63 |   test("is redirected away from /admin/staff", async ({ page }) => {
        at C:\Users\Pandikumar\Desktop\Kot-Pos\kot-pos-frontend\e2e\auth\Rbac.spec.ts:60:24

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results\auth-Rbac-Manager-role-access-can-access-admin-reports-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results\auth-Rbac-Manager-role-access-can-access-admin-reports-chromium\error-context.md

14. [chromium] › e2e\flows\Order.spec.ts:86:3 › Chef — Kitchen display › chef sees pending orders on KOT


    Error: expect(received).toBeTruthy()

    Received: false

      103 |       .catch(() => false);
      104 |
    > 105 |     expect(hasOrders || hasEmptyState).toBeTruthy();
          |                                        ^
      106 |   });
      107 |
      108 |   test("chef can mark an order as preparing", async ({ page }) => {
        at C:\Users\Pandikumar\Desktop\Kot-Pos\kot-pos-frontend\e2e\flows\Order.spec.ts:105:40

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results\flows-Order-Chef-—-Kitchen-823f8--sees-pending-orders-on-KOT-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results\flows-Order-Chef-—-Kitchen-823f8--sees-pending-orders-on-KOT-chromium\error-context.md

15. [chromium] › e2e\flows\Order.spec.ts:164:3 › Cashier — billing › cashier can see list of bills


    Error: expect(received).toBeTruthy()

    Received: false

      178 |       .catch(() => false);
      179 |
    > 180 |     expect(hasBills || hasEmptyState).toBeTruthy();
          |                                       ^
      181 |   });
      182 |
      183 |   test("cashier can mark a bill as paid", async ({ page }) => {
        at C:\Users\Pandikumar\Desktop\Kot-Pos\kot-pos-frontend\e2e\flows\Order.spec.ts:180:39

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results\flows-Order-Cashier-—-billing-cashier-can-see-list-of-bills-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results\flows-Order-Cashier-—-billing-cashier-can-see-list-of-bills-chromium\error-context.md

16. [chromium] › e2e\flows\Order.spec.ts:226:3 › Admin — dashboard › admin can navigate to menu management


    Error: expect(page).toHaveURL(expected) failed

    Expected pattern: /.*\/admin\/menu/
    Received string:  "http://localhost:5173/admin/dashboard"
    Timeout: 5000ms

    Call log:
      - Expect "toHaveURL" with timeout 5000ms
        2 × unexpected value "http://localhost:5173/login"
        6 × unexpected value "http://localhost:5173/admin/dashboard"


      228 |     await page.waitForURL(/.*\/admin\/menu/, { timeout: 10_000 });
      229 |
    > 230 |     await expect(page).toHaveURL(/.*\/admin\/menu/);
          |                        ^
      231 |     await expect(page).not.toHaveURL(/.*\/login/);
      232 |   });
      233 |
        at C:\Users\Pandikumar\Desktop\Kot-Pos\kot-pos-frontend\e2e\flows\Order.spec.ts:230:24

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results\flows-Order-Admin-—-dashbo-677f9-navigate-to-menu-management-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results\flows-Order-Admin-—-dashbo-677f9-navigate-to-menu-management-chromium\error-context.md

17. [chromium] › e2e\flows\Order.spec.ts:234:3 › Admin — dashboard › admin can navigate to staff page


    Error: expect(page).toHaveURL(expected) failed

    Expected pattern: /.*\/admin\/staff/
    Received string:  "http://localhost:5173/admin/dashboard"
    Timeout: 5000ms

    Call log:
      - Expect "toHaveURL" with timeout 5000ms
        2 × unexpected value "http://localhost:5173/login"
        6 × unexpected value "http://localhost:5173/admin/dashboard"


      236 |     await page.waitForURL(/.*\/admin\/staff/, { timeout: 10_000 });
      237 |
    > 238 |     await expect(page).toHaveURL(/.*\/admin\/staff/);
          |                        ^
      239 |   });
      240 |
      241 |   test("admin can navigate to reports", async ({ page }) => {
        at C:\Users\Pandikumar\Desktop\Kot-Pos\kot-pos-frontend\e2e\flows\Order.spec.ts:238:24

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results\flows-Order-Admin-—-dashbo-f77c2--can-navigate-to-staff-page-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results\flows-Order-Admin-—-dashbo-f77c2--can-navigate-to-staff-page-chromium\error-context.md

18. [chromium] › e2e\flows\Order.spec.ts:241:3 › Admin — dashboard › admin can navigate to reports


    Error: expect(page).toHaveURL(expected) failed

    Expected pattern: /.*\/admin\/reports/
    Received string:  "http://localhost:5173/admin/dashboard"
    Timeout: 5000ms

    Call log:
      - Expect "toHaveURL" with timeout 5000ms
        2 × unexpected value "http://localhost:5173/login"
        6 × unexpected value "http://localhost:5173/admin/dashboard"


      243 |     await page.waitForURL(/.*\/admin\/reports/, { timeout: 10_000 });
      244 |
    > 245 |     await expect(page).toHaveURL(/.*\/admin\/reports/);
          |                        ^
      246 |   });
      247 |
      248 |   test("admin sidebar shows all nav items", async ({ page }) => {
        at C:\Users\Pandikumar\Desktop\Kot-Pos\kot-pos-frontend\e2e\flows\Order.spec.ts:245:24

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results\flows-Order-Admin-—-dashboard-admin-can-navigate-to-reports-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results\flows-Order-Admin-—-dashboard-admin-can-navigate-to-reports-chromium\error-context.md

19. [chromium] › e2e\flows\Qr.spec.ts:18:3 › QR Code — public ordering flow › QR menu shows restaurant name and menu items


    Error: expect(received).toBeTruthy()

    Received: false

      30 |       .catch(() => false);
      31 |
    > 32 |     expect(hasRestaurantName || hasMenu).toBeTruthy();
         |                                          ^
      33 |   });
      34 |
      35 |   test("customer can browse menu categories", async ({ page }) => {
        at C:\Users\Pandikumar\Desktop\Kot-Pos\kot-pos-frontend\e2e\flows\Qr.spec.ts:32:42

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results\flows-Qr-QR-Code-—-public--8e28c-taurant-name-and-menu-items-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results\flows-Qr-QR-Code-—-public--8e28c-taurant-name-and-menu-items-chromium\error-context.md

20. [chromium] › e2e\flows\Qr.spec.ts:120:3 › QR Code — public ordering flow › shows 404 for non-existent table


    Error: expect(received).toBeTruthy()

    Received: false

      135 |       .catch(() => false);
      136 |
    > 137 |     expect(hasError || has404).toBeTruthy();
          |                                ^
      138 |   });
      139 | });
      140 |
        at C:\Users\Pandikumar\Desktop\Kot-Pos\kot-pos-frontend\e2e\flows\Qr.spec.ts:137:32

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results\flows-Qr-QR-Code-—-public--ab36d--404-for-non-existent-table-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results\flows-Qr-QR-Code-—-public--ab36d--404-for-non-existent-table-chromium\error-context.md

20 failed
[chromium] › e2e\auth\Login.spec.ts:41:3 › Sign In form › shows error on wrong password ────────
[chromium] › e2e\auth\Login.spec.ts:51:3 › Sign In form › shows error on non-existent username ─
[chromium] › e2e\auth\Login.spec.ts:101:3 › Sign In form › admin lands on /admin/dashboard after login
[chromium] › e2e\auth\Login.spec.ts:110:3 › Sign In form › waiter lands on /waiter/tables after login
[chromium] › e2e\auth\Login.spec.ts:119:3 › Sign In form › chef lands on /chef/kot after login ─
[chromium] › e2e\auth\Login.spec.ts:128:3 › Sign In form › cashier lands on /cashier/billing after login
[chromium] › e2e\auth\Login.spec.ts:140:3 › Logout › logout clears session and redirects to login
[chromium] › e2e\auth\Rbac.spec.ts:15:3 › Admin role access › can access /admin/menu ───────────
[chromium] › e2e\auth\Rbac.spec.ts:21:3 › Admin role access › can access /admin/staff ──────────
[chromium] › e2e\auth\Rbac.spec.ts:27:3 › Admin role access › can access /admin/reports ────────
[chromium] › e2e\auth\Rbac.spec.ts:33:3 › Admin role access › can access /admin/settings ───────
[chromium] › e2e\auth\Rbac.spec.ts:51:3 › Manager role access › can access /admin/menu ─────────
[chromium] › e2e\auth\Rbac.spec.ts:57:3 › Manager role access › can access /admin/reports ──────
[chromium] › e2e\flows\Order.spec.ts:86:3 › Chef — Kitchen display › chef sees pending orders on KOT
[chromium] › e2e\flows\Order.spec.ts:164:3 › Cashier — billing › cashier can see list of bills ─
[chromium] › e2e\flows\Order.spec.ts:226:3 › Admin — dashboard › admin can navigate to menu management
[chromium] › e2e\flows\Order.spec.ts:234:3 › Admin — dashboard › admin can navigate to staff page
[chromium] › e2e\flows\Order.spec.ts:241:3 › Admin — dashboard › admin can navigate to reports ─
[chromium] › e2e\flows\Qr.spec.ts:18:3 › QR Code — public ordering flow › QR menu shows restaurant name and menu items
[chromium] › e2e\flows\Qr.spec.ts:120:3 › QR Code — public ordering flow › shows 404 for non-existent table
8 skipped
43 passed (1.9m)
