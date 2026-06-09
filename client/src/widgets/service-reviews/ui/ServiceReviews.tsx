import clsx from "clsx";
import Icon from "@/shared/ui/Icon";
import styles from "./ServiceReviews.module.scss";

export type ServiceReviewItem = {
  id: string;
  author: string;
  car: string;
  date: string;
  rating: number;
  text: string;
};

type ServiceReviewsProps = {
  items: ServiceReviewItem[];
};

const ServiceReviews = ({ items }: ServiceReviewsProps) => {
  return (
    <div className={styles.list}>
      {items.map((item) => (
        <article className={clsx("surface", "surface--glass", styles.card)} key={item.id}>
          <div className={styles.header}>
            <div className={styles.authorBlock}>
              <div className={styles.avatar}>{item.author.slice(0, 1)}</div>
              <div className={styles.authorMeta}>
                <h3 className={styles.author}>{item.author}</h3>
                <span className={styles.car}>{item.car}</span>
              </div>
            </div>

            <div className={styles.ratingBlock}>
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
              <span className={styles.date}>{item.date}</span>
            </div>
          </div>

          <p className={styles.text}>{item.text}</p>
        </article>
      ))}
    </div>
  );
};

export default ServiceReviews;
