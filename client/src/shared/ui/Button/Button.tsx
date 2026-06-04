import { type ButtonHTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";
import styles from "./Button.module.scss";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Button = ({
  children,
  className,
  disabled = false,
  fullWidth = false,
  leftIcon,
  loading = false,
  rightIcon,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      aria-busy={loading}
      className={clsx(
        styles.button,
        styles[`button--${variant}`],
        styles[`button--${size}`],
        {
          [styles["button--full-width"]]: fullWidth,
          [styles["button--loading"]]: loading,
        },
        className,
      )}
      disabled={isDisabled}
      type={type}
    >
      {loading && <span aria-hidden="true" className={styles.loader} />}
      {leftIcon && !loading && (
        <span aria-hidden="true" className={styles.icon}>
          {leftIcon}
        </span>
      )}
      {children && <span className={styles.label}>{children}</span>}
      {rightIcon && !loading && (
        <span aria-hidden="true" className={styles.icon}>
          {rightIcon}
        </span>
      )}
    </button>
  );
};

export default Button;
