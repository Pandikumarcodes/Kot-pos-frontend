export interface SignUpFormData {
  username: string;
  password: string;
  confirmPassword: string;
  role: string;
  status: string;
}

export interface SignUpFormErrors {
  username?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  terms?: string;
  api?: string;
}

export const SIGNUP_ROLES = [
  { value: "manager", label: "Manager", emoji: "📋" },
  { value: "admin", label: "Admin", emoji: "⚙️" },
  { value: "cashier", label: "Cashier", emoji: "💳" },
  { value: "waiter", label: "Waiter", emoji: "🍽️" },
  { value: "chef", label: "Chef", emoji: "👨‍🍳" },
] as const;

export interface PasswordCheck {
  label: string;
  pass: boolean;
}

export interface SignUpPresenterProps {
  formData: SignUpFormData;
  errors: SignUpFormErrors;
  isLoading: boolean;
  agreeToTerms: boolean;
  showPassword: boolean;
  showConfirm: boolean;
  passwordChecks: PasswordCheck[];
  strengthCount: number;
  onFieldChange: (field: keyof SignUpFormData, value: string) => void;
  onToggleTerms: (v: boolean) => void;
  onTogglePassword: () => void;
  onToggleConfirm: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  onSignIn: () => void;
}
