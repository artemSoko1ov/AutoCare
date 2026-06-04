import { type ComponentPropsWithoutRef, type ElementType, type ReactNode, useId } from "react";
import clsx from "clsx";
import styles from "./Section.module.scss";

export type SectionSurface = "plain" | "card" | "glass";
export type SectionSpacing = "md" | "lg";
export type SectionAlign = "start" | "center";
export type SectionTitleSize = "h1" | "h2" | "h3";

export interface SectionProps extends Omit<ComponentPropsWithoutRef<"section">, "title"> {
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  surface?: SectionSurface;
  spacing?: SectionSpacing;
  align?: SectionAlign;
  titleAs?: ElementType;
  titleSize?: SectionTitleSize;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

const Section = ({
  actions,
  align = "start",
  bodyClassName,
  children,
  className,
  description,
  eyebrow,
  footer,
  footerClassName,
  headerClassName,
  id,
  surface = "plain",
  spacing = "lg",
  title,
  titleAs: TitleTag = "h2",
  titleSize = "h2",
  ...props
}: SectionProps) => {
  const generatedId = useId();
  const headingId = title ? `${id ?? generatedId}-title` : undefined;
  const hasHeader = Boolean(eyebrow || title || description || actions);

  return (
    <section
      {...props}
      aria-labelledby={headingId}
      className={clsx(
        styles.section,
        styles[`section--${surface}`],
        styles[`section--${spacing}`],
        styles[`section--${align}`],
        className,
      )}
      id={id}
    >
      <div className={clsx("container", "flow", styles.inner)}>
        {hasHeader && (
          <div className={clsx(styles.header, headerClassName)}>
            <div className={clsx("flow", styles.headerMain)}>
              {eyebrow && <div className={clsx("pill", styles.eyebrow)}>{eyebrow}</div>}
              {title && (
                <TitleTag
                  className={clsx("text-balance", styles.title, styles[`title--${titleSize}`])}
                  id={headingId}
                >
                  {title}
                </TitleTag>
              )}
              {description && (
                <p className={clsx("text-muted", styles.description)}>{description}</p>
              )}
            </div>

            {actions && <div className={clsx("actions-row", styles.actions)}>{actions}</div>}
          </div>
        )}

        <div className={clsx("flow", styles.body, bodyClassName)}>{children}</div>

        {footer && (
          <div className={clsx("actions-row", styles.footer, footerClassName)}>{footer}</div>
        )}
      </div>
    </section>
  );
};

export default Section;
