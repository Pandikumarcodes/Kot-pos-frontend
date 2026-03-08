// src/utils/validation.ts

export interface ValidationErrors {
  [key: string]: string;
}

// ── Helpers ───────────────────────────────────────────────────
const isEmpty = (val: string) => !val || val.trim().length === 0;
const isTooShort = (val: string, min: number) => val.trim().length < min;
const isTooLong = (val: string, max: number) => val.trim().length > max;

// ── Login Validation ──────────────────────────────────────────
export const validateLogin = (data: {
  username: string;
  password: string;
}): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (isEmpty(data.username)) {
    errors.username = "Username is required";
  } else if (isTooShort(data.username, 3)) {
    errors.username = "Username must be at least 3 characters";
  } else if (isTooLong(data.username, 30)) {
    errors.username = "Username must be under 30 characters";
  }

  if (isEmpty(data.password)) {
    errors.password = "Password is required";
  } else if (isTooShort(data.password, 6)) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};

// ── Staff Validation ──────────────────────────────────────────
const ALLOWED_ROLES = ["admin", "chef", "waiter", "cashier", "manager"];
const ALLOWED_STATUSES = ["active", "locked"];

export const validateStaff = (
  data: {
    username: string;
    password: string;
    role: string;
    status: string;
  },
  isEditing = false,
): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!isEditing) {
    // Username
    if (isEmpty(data.username)) {
      errors.username = "Username is required";
    } else if (isTooShort(data.username, 3)) {
      errors.username = "Username must be at least 3 characters";
    } else if (isTooLong(data.username, 30)) {
      errors.username = "Username must be under 30 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
      errors.username = "Only letters, numbers and underscore allowed";
    }

    // Password
    if (isEmpty(data.password)) {
      errors.password = "Password is required";
    } else if (isTooShort(data.password, 8)) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(data.password)) {
      errors.password = "Password must contain at least one uppercase letter";
    } else if (!/[0-9]/.test(data.password)) {
      errors.password = "Password must contain at least one number";
    }

    // Status
    if (!ALLOWED_STATUSES.includes(data.status)) {
      errors.status = "Invalid status selected";
    }
  }

  // Role — validate for both create and edit
  if (!ALLOWED_ROLES.includes(data.role)) {
    errors.role = "Invalid role selected";
  }

  return errors;
};

// ── Menu Item Validation ──────────────────────────────────────
const ALLOWED_CATEGORIES = [
  "starter",
  "main_course",
  "dessert",
  "beverage",
  "snacks",
  "side_dish",
  "bread",
  "rice",
  "combo",
  "special",
];

export const validateMenuItem = (
  data: {
    ItemName: string;
    price: number;
    category: string;
  },
  isEditing = false,
): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!isEditing) {
    // Item name
    if (isEmpty(data.ItemName)) {
      errors.ItemName = "Item name is required";
    } else if (isTooShort(data.ItemName, 2)) {
      errors.ItemName = "Item name must be at least 2 characters";
    } else if (isTooLong(data.ItemName, 50)) {
      errors.ItemName = "Item name must be under 50 characters";
    }

    // Category
    if (!ALLOWED_CATEGORIES.includes(data.category)) {
      errors.category = "Invalid category selected";
    }
  }

  // Price — validate for both create and edit
  if (!data.price || isNaN(data.price)) {
    errors.price = "Price is required";
  } else if (data.price <= 0) {
    errors.price = "Price must be greater than 0";
  } else if (data.price > 99999) {
    errors.price = "Price seems too high";
  }

  return errors;
};

// ── Helper: has errors? ───────────────────────────────────────
export const hasErrors = (errors: ValidationErrors): boolean =>
  Object.keys(errors).length > 0;
