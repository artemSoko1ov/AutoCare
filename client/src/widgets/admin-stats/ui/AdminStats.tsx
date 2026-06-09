import clsx from "clsx";
import type { AdminStat } from "@/entities/admin/model";
import Icon from "@/shared/ui/Icon";
import styles from "./AdminStats.module.scss";

type AdminStatsProps = {
  items: AdminStat[];
};

const AdminStats = ({ items }: AdminStatsProps) => {
  return (
    <article className={clsx("surface", "surface--glass", styles.section)}>
      <div className={styles.header}>
        <h2 className={styles.title}>Дашборд</h2>
        <p className={styles.description}>
          Краткая сводка по заявкам, отзывам и услугам на основе актуальных данных системы.
        </p>
      </div>

      <div className={styles.grid}>
        {items.map((item) => (
          <div className={styles.card} key={item.id}>
            <span className={styles.icon}>
              <Icon name={item.icon} />
            </span>
            <span className={styles.value}>{item.value}</span>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <p className={styles.hint}>{item.hint}</p>
          </div>
        ))}
      </div>
    </article>
  );
};

export default AdminStats;
