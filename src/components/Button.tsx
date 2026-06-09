import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  variant?: ButtonVariant;
}

export function Button({ children, className = "", icon, variant = "secondary", ...props }: ButtonProps) {
  return (
    <button className={`cms-button cms-button--${variant} ${className}`.trim()} type="button" {...props}>
      {icon}
      {children}
    </button>
  );
}

export function IconButton({ className = "", children, ...props }: ButtonProps) {
  return (
    <Button className={`cms-icon-button ${className}`.trim()} variant="ghost" {...props}>
      {children}
    </Button>
  );
}
