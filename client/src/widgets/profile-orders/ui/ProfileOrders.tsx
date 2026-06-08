import clsx from "clsx";
import type { ProfileOrderItem } from "@/entities/profile/model";
import Icon from "@/shared/ui/Icon";
import styles from "./ProfileOrders.module.scss";

type ProfileOrdersProps = {
  section: {
    title: string;
    actionLabel: string;
    items: ProfileOrderItem[];
  };
};

const ProfileOrders = ({ section }: ProfileOrdersProps) => {
  return (
    <div className={clsx("surface", "surface--glass", styles.card)}>
      <div className={styles.header}>
        <h2 className={styles.title}>{section.title}</h2>
        <button className={styles.link} type="button">
          {section.actionLabel}
        </button>
      </div>

      <div className={styles.list}>
        {section.items.map((item) => (
          <button className={styles.item} key={item.id} type="button">
            <div className={clsx(styles.thumb, styles[`thumb--${item.accent}`])}>
              <Icon name={item.icon} />
            </div>

            <div className={styles.body}>
              <h3 className={styles.itemTitle}>{item.title}</h3>
              <p className={styles.itemMeta}>{item.meta}</p>
              <p className={styles.itemDate}>{item.date}</p>
            </div>

            <div className={styles.side}>
              <span className={clsx(styles.status, styles[`status--${item.statusTone}`])}>
                {item.statusLabel}
              </span>
              <span className={styles.price}>{item.price}</span>
            </div>

            <span className={styles.arrow}>
              <Icon name="chevron-right" />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileOrders;
