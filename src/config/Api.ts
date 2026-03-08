// ─────────────────────────────────────────────
// All API base URLs and endpoint paths.
// Change base URL here → updates all API calls.
// ─────────────────────────────────────────────

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
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
} as const;
