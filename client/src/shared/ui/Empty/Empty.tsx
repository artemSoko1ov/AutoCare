import type { ReactNode } from "react";
import clsx from "clsx";
import Icon, { type IconName } from "@/shared/ui/Icon";
import styles from "./Empty.module.scss";

type EmptyProps = {
  title: string;
  description: string;
  icon?: IconName;
  action?: ReactNode;
  compact?: boolean;
  className?: string;
};

const Empty = ({
  action,
  className,
  compact = false,
  description,
  icon = "car",
  title,
}: EmptyProps) => {
  return (
    <div className={clsx(styles.empty, { [styles["empty--compact"]]: compact }, className)}>
      <div className={styles.icon}>
        <Icon name={icon} />
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>

      {action ? <div className={styles.actions}>{action}</div> : null}
    </div>
  );
};

export default Empty;
