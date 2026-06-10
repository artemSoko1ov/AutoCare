import { forwardRef, type InputHTMLAttributes, type ReactNode, useId } from "react";
import clsx from "clsx";
import styles from "./Input.module.scss";

export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  rightAction?: ReactNode;
  fullWidth?: boolean;
  inputClassName?: string;
  size?: InputSize;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      disabled = false,
      error,
      fullWidth = true,
      hint,
      id,
      inputClassName,
      label,
      leftIcon,
      rightAction,
      rightIcon,
      size = "md",
      type = "text",
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const descriptionId = `${inputId}-description`;
    const hasError = Boolean(error);
    const hasDescription = Boolean(error || hint);

    return (
      <div
        className={clsx(
          styles.field,
          styles[`field--${size}`],
          {
            [styles["field--full-width"]]: fullWidth,
            [styles["field--disabled"]]: disabled,
            [styles["field--invalid"]]: hasError,
          },
          className,
        )}
      >
        {label && (
          <label className={styles.label} htmlFor={inputId}>
            {label}
          </label>
        )}

        <div className={styles.control}>
          {leftIcon && (
            <span aria-hidden="true" className={styles.icon}>
              {leftIcon}
            </span>
          )}

          <input
            {...props}
            ref={ref}
            aria-describedby={hasDescription ? descriptionId : undefined}
            aria-invalid={hasError}
            className={clsx(styles.input, inputClassName)}
            disabled={disabled}
            id={inputId}
            type={type}
          />

          {rightAction && (
            <span className={clsx(styles.icon, styles["icon--action"])}>{rightAction}</span>
          )}

          {!rightAction && rightIcon && (
            <span aria-hidden="true" className={styles.icon}>
              {rightIcon}
            </span>
          )}
        </div>

        {hasDescription && (
          <p
            className={clsx(styles.description, {
              [styles["description--error"]]: hasError,
            })}
            id={descriptionId}
          >
            {error ?? hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
