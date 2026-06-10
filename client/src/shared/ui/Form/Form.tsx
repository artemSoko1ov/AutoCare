import { type ComponentPropsWithoutRef, type ElementType, type ReactNode, useId } from "react";
import clsx from "clsx";
import styles from "./Form.module.scss";

export type FormSurface = "card" | "glass";
export type FormWidth = "sm" | "md" | "lg";
export type FormTitleSize = "h1" | "h2" | "h3";

export interface FormProps extends Omit<ComponentPropsWithoutRef<"form">, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  surface?: FormSurface;
  width?: FormWidth;
  titleAs?: ElementType;
  titleSize?: FormTitleSize;
  headerClassName?: string;
  bodyClassName?: string;
  actionsClassName?: string;
  footerClassName?: string;
}

const Form = ({
  actions,
  actionsClassName,
  bodyClassName,
  children,
  className,
  description,
  error,
  footer,
  footerClassName,
  headerClassName,
  id,
  surface = "glass",
  title,
  titleAs: TitleTag = "h2",
  titleSize = "h2",
  width = "md",
  ...props
}: FormProps) => {
  const generatedId = useId();
  const headingId = title ? `${id ?? generatedId}-title` : undefined;
  const hasHeader = Boolean(title || description);

  return (
    <form
      {...props}
      aria-labelledby={headingId}
      className={clsx(styles.form, styles[`form--${surface}`], styles[`form--${width}`], className)}
      id={id}
    >
      {hasHeader && (
        <div className={clsx("flow", styles.header, headerClassName)}>
          {title && (
            <TitleTag className={clsx(styles.title, styles[`title--${titleSize}`])} id={headingId}>
              {title}
            </TitleTag>
          )}

          {description && <p className={styles.description}>{description}</p>}
        </div>
      )}

      {error && (
        <div aria-live="polite" className={styles.error} role="alert">
          {error}
        </div>
      )}

      <div className={clsx("flow", styles.body, bodyClassName)}>{children}</div>

      {actions && (
        <div className={clsx("actions-row", styles.actions, actionsClassName)}>{actions}</div>
      )}

      {footer && <div className={clsx(styles.footer, footerClassName)}>{footer}</div>}
    </form>
  );
};

export default Form;
