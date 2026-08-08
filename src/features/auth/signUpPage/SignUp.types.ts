export interface SignUpFormData {
  username: string;
  password: string;
  confirmPassword: string;
  status: string;
}

export interface SignUpFormErrors {
  username?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  api?: string;
}

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
