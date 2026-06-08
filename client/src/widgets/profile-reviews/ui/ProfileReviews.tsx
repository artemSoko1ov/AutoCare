import clsx from "clsx";
import type { ProfileReviewItem } from "@/entities/profile/model";
import Icon from "@/shared/ui/Icon";
import styles from "./ProfileReviews.module.scss";

type ProfileReviewsProps = {
  section: {
    title: string;
    actionLabel: string;
    items: ProfileReviewItem[];
  };
};

const ProfileReviews = ({ section }: ProfileReviewsProps) => {
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
          <div className={styles.item} key={item.id}>
            <div className={clsx(styles.thumb, styles[`thumb--${item.accent}`])}>
              <Icon name={item.icon} />
            </div>

            <div className={styles.body}>
              <div className={styles.mainRow}>
                <div className={styles.main}>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                  <div aria-label={`Оценка ${item.rating} из 5`} className={styles.rating}>
                    {Array.from({ length: 5 }, (_, index) => (
                      <span
                        className={clsx(styles.star, {
                          [styles["star--active"]]: index < item.rating,
                        })}
                        key={`${item.id}-${index + 1}`}
                      >
                        <Icon name="star" />
                      </span>
                    ))}
                  </div>
                </div>

                <span className={styles.date}>{item.date}</span>
              </div>

              <p className={styles.text}>{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileReviews;
