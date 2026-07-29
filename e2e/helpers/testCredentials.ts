import { AUTH_STATE } from "./authState";

type CredentialRole = keyof typeof AUTH_STATE;

const ENV_KEYS: Record<
  CredentialRole,
  { username: string; password: string }
> = {
  admin: {
    username: "E2E_ADMIN_USERNAME",
    password: "E2E_ADMIN_PASSWORD",
  },
  manager: {
    username: "E2E_MANAGER_USERNAME",
    password: "E2E_MANAGER_PASSWORD",
  },
  waiter: {
    username: "E2E_WAITER_USERNAME",
    password: "E2E_WAITER_PASSWORD",
  },
  cashier: {
    username: "E2E_CASHIER_USERNAME",
    password: "E2E_CASHIER_PASSWORD",
  },
  chef: {
    username: "E2E_CHEF_USERNAME",
    password: "E2E_CHEF_PASSWORD",
  },
};

const missingVariables = Object.values(ENV_KEYS)
  .flatMap(({ username, password }) => [username, password])
  .filter((name) => !process.env[name]?.trim());

if (missingVariables.length > 0) {
  throw new Error(
    `Missing required Playwright credentials: ${missingVariables.join(", ")}`,
  );
}

export const E2E_CREDENTIALS: Record<
  CredentialRole,
  { username: string; password: string }
> = Object.fromEntries(
  Object.entries(ENV_KEYS).map(([role, keys]) => [
    role,
    {
      username: process.env[keys.username]!,
      password: process.env[keys.password]!,
    },
  ]),
) as Record<CredentialRole, { username: string; password: string }>;
