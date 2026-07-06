
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

// ── Button ──────────────────────────────────────────────────────────────────

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "gold";
type ButtonSize    = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const BUTTON_BASE =
  "inline-flex items-center justify-center font-medium transition-all focus-ring disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary:   "btn-primary",
  secondary: "btn-outline",
  danger:    "btn-danger",
  ghost:     "btn-ghost",
  gold:      "btn-gold",
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: "h-8  px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(BUTTON_BASE, BUTTON_VARIANTS[variant], BUTTON_SIZES[size], className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

// ── Input ────────────────────────────────────────────────────────────────────

const FIELD_BASE = "field w-full px-3 py-2 text-sm";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(FIELD_BASE, className)} {...props} />
  ),
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(FIELD_BASE, "min-h-[80px]", className)} {...props} />
  ),
);
Textarea.displayName = "Textarea";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(FIELD_BASE, "pr-8 appearance-none", className)}
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%239d94c4' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 0.75rem center" }}
      {...props}
    />
  ),
);
Select.displayName = "Select";

// ── Label ────────────────────────────────────────────────────────────────────

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("field-label", className)} {...props} />;
}

// ── Card ─────────────────────────────────────────────────────────────────────

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("card", className)} {...props} />;
}

// ── Alert ────────────────────────────────────────────────────────────────────

type AlertVariant = "error" | "success" | "warning" | "info";

const ALERT_STYLES: Record<AlertVariant, string> = {
  error:   "alert-error",
  success: "alert-success",
  warning: "alert-warning",
  info:    "alert-info",
};

export function Alert({
  variant = "info",
  children,
  className,
}: {
  variant?:  AlertVariant;
  children:  React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(ALERT_STYLES[variant], className)}
    >
      {children}
    </div>
  );
}

// ── Badge ────────────────────────────────────────────────────────────────────

type BadgeVariant = "purple" | "gold" | "gray" | "green" | "red";

const BADGE_VARIANTS: Record<BadgeVariant, string> = {
  purple: "badge-purple",
  gold:   "badge-gold",
  gray:   "badge-gray",
  green:  "badge-green",
  red:    "badge-red",
};

export function Badge({
  children,
  className,
  variant = "gray",
}: {
  children:   React.ReactNode;
  className?:  string;
  variant?:    BadgeVariant;
}) {
  return (
    <span className={cn("badge", BADGE_VARIANTS[variant], className)}>
      {children}
    </span>
  );
}
