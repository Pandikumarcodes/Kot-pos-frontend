// src/components/atoms/Input/Input.tsx
import React, { forwardRef, useId } from "react";

export type InputVariant = "default" | "filled" | "outlined";
export type InputSize = "sm" | "md" | "lg";
export type InputStatus = "default" | "error" | "success" | "warning";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: InputVariant;
  inputSize?: InputSize;
  status?: InputStatus;
  label?: string;
  helperText?: string;
  error?: string;
  success?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  required?: boolean;
}

const variants: Record<InputVariant, string> = {
  default: "bg-kot-white border border-kot-chart",
  filled:
    "bg-kot-light border-b-2 border-kot-chart rounded-t-lg rounded-b-none",
  outlined: "bg-transparent border-2 border-kot-chart",
};

const sizes: Record<InputSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-3 py-2 text-base",
  lg: "px-4 py-3 text-lg",
};

const statusStyles: Record<InputStatus, string> = {
  default: "focus:border-kot-primary focus:ring-2 focus:ring-kot-primary/20",
  error:
    "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
  success:
    "border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-500/20",
  warning:
    "border-yellow-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = "default",
      inputSize = "md",
      status = "default",
      label,
      helperText,
      error,
      success,
      leftIcon,
      rightIcon,
      fullWidth = false,
      required = false,
      className = "",
      disabled = false,
      id,
      ...props
    },
    ref
  ) => {
    // Determine the current status based on props
    const currentStatus = error ? "error" : success ? "success" : status;
    const messageText = error || success || helperText;

    // Generate stable unique ID using React's useId hook
    const generatedId = useId();
    const inputId = id || generatedId;

    // Icon wrapper sizing based on input size
    const iconSize = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    }[inputSize];

    const iconPadding = {
      sm: leftIcon ? "pl-9" : rightIcon ? "pr-9" : "",
      md: leftIcon ? "pl-10" : rightIcon ? "pr-10" : "",
      lg: leftIcon ? "pl-12" : rightIcon ? "pr-12" : "",
    }[inputSize];

    return (
      <div className={`${fullWidth ? "w-full" : "w-auto"}`}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-kot-darker mb-1.5"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconSize} text-kot-text pointer-events-none`}
            >
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-invalid={currentStatus === "error"}
            aria-describedby={messageText ? `${inputId}-message` : undefined}
            className={`
              w-full rounded-lg
              ${variants[variant]}
              ${sizes[inputSize]}
              ${statusStyles[currentStatus]}
              ${iconPadding}
              ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}
              text-kot-darker placeholder:text-kot-text/50
              transition-all duration-200
              outline-none
              ${className}
            `}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${iconSize} text-kot-text`}
            >
              {rightIcon}
            </div>
          )}
        </div>

        {/* Helper Text / Error / Success Message */}
        {messageText && (
          <p
            id={`${inputId}-message`}
            className={`mt-1.5 text-sm ${
              currentStatus === "error"
                ? "text-red-500"
                : currentStatus === "success"
                ? "text-green-500"
                : currentStatus === "warning"
                ? "text-yellow-500"
                : "text-kot-text"
            }`}
          >
            {messageText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

// Example usage:
// <Input
//   label="Email"
//   type="email"
//   placeholder="Enter your email"
//   leftIcon={<MailIcon />}
//   error="Invalid email address"
//   required
// />
