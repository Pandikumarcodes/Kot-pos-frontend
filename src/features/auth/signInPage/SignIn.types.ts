export interface SignInFormData {
  username: string;
  password: string;
}

export interface SignInFormErrors {
  username?: string;
  password?: string;
  api?: string;
}

export interface SignInPresenterProps {
  formData: SignInFormData;
  errors: SignInFormErrors;
  isLoading: boolean;
  rememberMe: boolean;
  showPassword: boolean;
  onFieldChange: (field: keyof SignInFormData, value: string) => void;
  onTogglePassword: () => void;
  onToggleRemember: (v: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  onSignUp: () => void;
}
