// src/config/Api.ts
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

// Use this for direct axios calls that don't go through apiClient.ts
// e.g. SignUpPage.tsx uses raw axios — use API_V1_URL there
export const API_V1_URL = `${API_BASE_URL}/api/v1`;

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    REFRESH: "/auth/refresh",
  },

  // Admin - Menu
  MENU: {
    GET_ALL: "/admin/menuItems",
    CREATE: "/admin/menu",
    UPDATE: (id: string) => `/admin/menu-item/${id}`,
    DELETE: (id: string) => `/admin/delete/${id}`,
  },

  // Admin - Tables
  TABLES: {
    GET_ALL: "/admin/tables",
    GET_ONE: (id: string) => `/admin/tables/${id}`,
    CREATE: "/admin/tables",
    UPDATE: (id: string) => `/admin/tables/${id}`,
    DELETE: (id: string) => `/admin/tables/${id}`,
  },

  // Admin - Users/Staff
  USERS: {
    GET_ALL: "/admin/users",
    CREATE: "/admin/create-user",
    UPDATE_ROLE: (id: string) => `/admin/update-role/${id}`,
    DELETE: (id: string) => `/admin/deleteUser/${id}`,
  },

  // Admin - Inventory
  INVENTORY: {
    GET_ALL: "/admin/inventory",
    CREATE: "/admin/inventory",
    UPDATE: (id: string) => `/admin/inventory/${id}`,
    RESTOCK: (id: string) => `/admin/inventory/${id}/restock`,
    ADJUST: (id: string) => `/admin/inventory/${id}/adjust`,
    LOGS: (id: string) => `/admin/inventory/${id}/logs`,
    DELETE: (id: string) => `/admin/inventory/${id}`,
  },

  // Admin - Reports
  REPORTS: {
    SUMMARY: "/admin/reports/summary",
    TOP_ITEMS: "/admin/reports/top-items",
    PAYMENTS: "/admin/reports/payments",
    HOURLY: "/admin/reports/hourly",
  },

  // Waiter - Tables
  WAITER: {
    ALLOCATE: (id: string) => `/waiter/allocate/${id}`,
    FREE: (id: string) => `/waiter/free/${id}`,
  },

  // Waiter - Orders
  ORDERS: {
    GET_ALL: "/waiter/orders",
    GET_ONE: (id: string) => `/waiter/orders/${id}`,
    CREATE: "/waiter/orders",
    SEND: (id: string) => `/waiter/orders/${id}/send`,
    SERVED: (id: string) => `/waiter/orders/${id}/served`,
    CANCEL: (id: string) => `/waiter/orders/${id}/cancel`,
  },

  // Chef - KOT
  CHEF: {
    GET_ALL: "/chef/kot",
    GET_ONE: (id: string) => `/chef/kot/${id}`,
    START: (id: string) => `/chef/kot/${id}/start`,
    READY: (id: string) => `/chef/kot/${id}/ready`,
    CANCEL: (id: string) => `/chef/kot/${id}/cancel`,
  },

  // Cashier
  CASHIER: {
    TAKEAWAY: "/cashier/takeaway-orders",
    BILLS: "/cashier/bills",
    BILL_PAY: (id: string) => `/cashier/bills/${id}/pay`,
    INCOME: "/cashier/income",
  },

  // Public - QR menu (no auth)
  PUBLIC: {
    MENU: (tableId: string) => `/public/menu/${tableId}`,
    ORDER: (tableId: string) => `/public/order/${tableId}`,
    ORDER_STATUS: (orderId: string) => `/public/order/${orderId}/status`,
  },
} as const;
