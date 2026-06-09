import clsx from "clsx";
import { NavLink } from "react-router-dom";
import type { ProfileReviewsSection } from "@/entities/review";
import Button from "@/shared/ui/Button";
import Empty from "@/shared/ui/Empty";
import Icon from "@/shared/ui/Icon";
import styles from "./ProfileReviews.module.scss";

type ProfileReviewsProps = {
  section: ProfileReviewsSection;
  isLoading?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
};

const ProfileReviews = ({
  section,
  isLoading = false,
  errorMessage = null,
  onRetry,
}: ProfileReviewsProps) => {
  return (
    <div className={clsx("surface", "surface--glass", styles.card)}>
      <div className={styles.header}>
        <h2 className={styles.title}>{section.title}</h2>
        {section.actionLabel && section.actionTo ? (
          <NavLink className={styles.link} to={section.actionTo}>
            {section.actionLabel}
          </NavLink>
        ) : null}
      </div>

      {isLoading ? (
        <div className={styles.state}>
          <p className={styles.stateTitle}>Загружаем отзывы</p>
          <p className={styles.stateDescription}>
            Подтягиваем ваши последние оценки и комментарии из профиля.
          </p>
        </div>
      ) : errorMessage ? (
        <div className={styles.state}>
          <p className={styles.stateTitle}>Не удалось загрузить отзывы</p>
          <p className={styles.stateDescription}>{errorMessage}</p>
          {onRetry ? (
            <Button className={styles.stateAction} onClick={onRetry} size="sm" variant="secondary">
              Повторить
            </Button>
          ) : null}
        </div>
      ) : section.items.length > 0 ? (
        <div className={styles.list}>
          {section.items.map((item) => {
            const content = (
              <>
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
              </>
            );

            if (item.to) {
              return (
                <NavLink
                  className={clsx(styles.item, styles["item--interactive"])}
                  key={item.id}
                  to={item.to}
                >
                  {content}
                </NavLink>
              );
            }

            return (
              <div className={styles.item} key={item.id}>
                {content}
              </div>
            );
          })}
        </div>
      ) : (
        <Empty
          compact
          description="После первой завершенной заявки ваши отзывы появятся в этом разделе."
          icon="star"
          title="Отзывов пока нет"
        />
      )}
    </div>
  );
};

export default ProfileReviews;
