import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../Store/hooks";
import { setCredentials } from "../../../Store/Slices/authSlice";
import api from "../../../services/apiClient";
import { validateLogin, hasErrors } from "../../../utils/validation";
import { SignInPresenter } from "./SignInPresenter";
import type { SignInFormData, SignInFormErrors } from "./SignIn.types";

const ROLE_HOME: Record<string, string> = {
  admin: "/admin/dashboard",
  manager: "/admin/dashboard",
  cashier: "/cashier/billing",
  waiter: "/waiter/tables",
  chef: "/chef/kot",
};

export default function SignInContainer() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<SignInFormData>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<SignInFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFieldChange = (field: keyof SignInFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateLogin(formData);
    if (hasErrors(errs)) {
      setErrors(errs);
      return;
    }
    setIsLoading(true);
    setErrors({});
    try {
      const res = await api.post("/auth/login", {
        username: formData.username.trim(),
        password: formData.password,
      });
      const { user } = res.data;
      dispatch(
        setCredentials({
          id: user.id,
          name: user.username,
          email: user.username,
          role: user.role,
        }),
      );
      navigate(ROLE_HOME[user.role] ?? "/");
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setErrors({
        api: error?.response?.data?.error || "Invalid username or password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignInPresenter
      formData={formData}
      errors={errors}
      isLoading={isLoading}
      rememberMe={rememberMe}
      showPassword={showPassword}
      onFieldChange={handleFieldChange}
      onTogglePassword={() => setShowPassword((v) => !v)}
      onToggleRemember={setRememberMe}
      onSubmit={handleSubmit}
      onBack={() => navigate("/login")}
      onSignUp={() => navigate("/signup")}
    />
  );
}
