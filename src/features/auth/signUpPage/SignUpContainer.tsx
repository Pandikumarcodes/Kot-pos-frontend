import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../config/Api";
import { SignUpPresenter } from "./SignUpPresenter";
import type { SignUpFormData, SignUpFormErrors } from "./SignUp.types";

export default function SignUpContainer() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SignUpFormData>({
    username: "",
    password: "",
    confirmPassword: "",
    role: "waiter",
    status: "active",
  });
  const [errors, setErrors] = useState<SignUpFormErrors>({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleFieldChange = (field: keyof SignUpFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof SignUpFormErrors])
      setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): SignUpFormErrors => {
    const e: SignUpFormErrors = {};
    if (!formData.username.trim()) e.username = "Username is required";
    else if (formData.username.trim().length < 2)
      e.username = "At least 2 characters";
    if (!formData.password) e.password = "Password is required";
    else if (formData.password.length < 8) e.password = "Minimum 8 characters";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      e.password = "Must contain uppercase, lowercase and number";
    if (!formData.confirmPassword)
      e.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    if (!formData.role) e.role = "Please select a role";
    if (!agreeToTerms) e.terms = "You must agree to the terms";
    return e;
  };

  const passwordChecks = [
    { label: "At least 8 characters", pass: formData.password.length >= 8 },
    {
      label: "Uppercase & lowercase",
      pass: /(?=.*[a-z])(?=.*[A-Z])/.test(formData.password),
    },
    { label: "Contains a number", pass: /(?=.*\d)/.test(formData.password) },
  ];
  const strengthCount = passwordChecks.filter((c) => c.pass).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setIsLoading(true);
    setErrors({});
    try {
      await axios.post(
        `${API_BASE_URL}/auth/signup`,
        {
          username: formData.username,
          password: formData.password,
          role: formData.role,
          status: formData.status,
        },
        { withCredentials: true },
      );
      navigate("/signin");
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setErrors({
        api: error?.response?.data?.error || "Registration failed. Try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignUpPresenter
      formData={formData}
      errors={errors}
      isLoading={isLoading}
      agreeToTerms={agreeToTerms}
      showPassword={showPassword}
      showConfirm={showConfirm}
      passwordChecks={passwordChecks}
      strengthCount={strengthCount}
      onFieldChange={handleFieldChange}
      onToggleTerms={(v) => {
        setAgreeToTerms(v);
        if (errors.terms) setErrors((p) => ({ ...p, terms: undefined }));
      }}
      onTogglePassword={() => setShowPassword((v) => !v)}
      onToggleConfirm={() => setShowConfirm((v) => !v)}
      onSubmit={handleSubmit}
      onBack={() => navigate("/login")}
      onSignIn={() => navigate("/signin")}
    />
  );
}
