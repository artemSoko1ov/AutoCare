import type { ReactNode } from "react";
import clsx from "clsx";
import Icon from "@/shared/ui/Icon";
import styles from "./BookingCta.module.scss";

type BookingCtaProps = {
  className?: string;
  icon?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
};

const BookingCta = ({
  action,
  className = "",
  description = "",
  icon,
  title = "",
}: BookingCtaProps) => {
  return (
    <section className={clsx("container", styles.bookingCta, className)}>
      <div className={styles.content}>
        <div aria-hidden="true" className={styles.icon}>
          {icon ?? <Icon name="support" />}
        </div>

        <div className={styles.text}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>
        </div>
      </div>

      {action ? <div className={styles.actions}>{action}</div> : null}
    </section>
  );
};

export default BookingCta;
