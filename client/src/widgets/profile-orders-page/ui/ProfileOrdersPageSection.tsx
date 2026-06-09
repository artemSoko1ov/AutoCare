import clsx from "clsx";
import type { ProfileOrdersPageSection as ProfileOrdersPageSectionData } from "@/entities/order";
import Button from "@/shared/ui/Button";
import Empty from "@/shared/ui/Empty";
import Icon from "@/shared/ui/Icon";
import styles from "./ProfileOrdersPageSection.module.scss";

type ProfileOrdersPageSectionProps = {
  section: ProfileOrdersPageSectionData;
  isLoading?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
};

const ProfileOrdersPageSection = ({
  section,
  isLoading = false,
  errorMessage = null,
  onRetry,
}: ProfileOrdersPageSectionProps) => {
  return (
    <article className={clsx("surface", "surface--glass", styles.section)}>
      <div className={styles.header}>
        <div className={styles.heading}>
          <h2 className={styles.title}>{section.title}</h2>
          <p className={styles.description}>{section.description}</p>
        </div>
      </div>

      {!isLoading && !errorMessage && section.items.length > 0 ? (
        <div className={styles.stats}>
          {section.stats.map((item) => (
            <div className={styles.statCard} key={item.id}>
              <span className={clsx(styles.statIcon, styles[`statIcon--${item.accent}`])}>
                <Icon name={item.icon} />
              </span>

              <div className={styles.statBody}>
                <span className={styles.statValue}>{item.value}</span>
                <span className={styles.statLabel}>{item.label}</span>
                <span className={styles.statDescription}>{item.description}</span>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {isLoading ? (
        <div className={styles.state}>
          <p className={styles.stateTitle}>Загружаем список заказов</p>
          <p className={styles.stateDescription}>
            Получаем актуальные обращения из вашего профиля.
          </p>
        </div>
      ) : errorMessage ? (
        <div className={styles.state}>
          <p className={styles.stateTitle}>Не удалось загрузить заказы</p>
          <p className={styles.stateDescription}>{errorMessage}</p>
          {onRetry ? (
            <Button onClick={onRetry} size="sm" variant="secondary">
              Повторить
            </Button>
          ) : null}
        </div>
      ) : section.items.length > 0 ? (
        <div className={styles.grid}>
          {section.items.map((item) => (
            <article className={styles.card} key={item.id}>
              <div className={styles.cardHeader}>
                <div className={clsx(styles.thumb, styles[`thumb--${item.accent}`])}>
                  <Icon name="wrench" />
                </div>

                <div className={styles.cardHead}>
                  <div className={styles.cardTop}>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <span className={clsx(styles.badge, styles[`badge--${item.statusTone}`])}>
                      {item.statusLabel}
                    </span>
                  </div>

                  <p className={styles.cardMeta}>{item.meta}</p>
                </div>
              </div>

              <div className={styles.details}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Создан</span>
                  <span className={styles.detailValue}>{item.createdAt}</span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Запланирован</span>
                  <span className={styles.detailValue}>{item.scheduledFor}</span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Стоимость</span>
                  <span className={styles.detailValue}>{item.price}</span>
                </div>

                <div className={clsx(styles.detailItem, styles.detailItemWide)}>
                  <span className={styles.detailLabel}>Комментарий</span>
                  <span className={styles.detailValue}>
                    {item.notes || "Комментарий к заявке не указан"}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <Empty
          compact
          description="После первой записи в сервис здесь появится история ваших обращений."
          icon="orders"
          title="Заказов пока нет"
        />
      )}
    </article>
  );
};

export default ProfileOrdersPageSection;
