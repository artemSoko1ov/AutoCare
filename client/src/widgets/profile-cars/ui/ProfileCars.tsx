import clsx from "clsx";
import type { ProfileCarsSection } from "@/entities/car";
import type { GarageFeedback } from "@/features/car/manage";
import Button from "@/shared/ui/Button";
import Empty from "@/shared/ui/Empty";
import Icon from "@/shared/ui/Icon";
import styles from "./ProfileCars.module.scss";

type ProfileCarsProps = {
  section: ProfileCarsSection;
  isLoading?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
  onCreate?: () => void;
  onEdit?: (carId: string) => void;
  onDelete?: (carId: string) => void;
  feedback?: GarageFeedback | null;
};

const ProfileCars = ({
  section,
  isLoading = false,
  errorMessage = null,
  onRetry,
  onCreate,
  onEdit,
  onDelete,
  feedback = null,
}: ProfileCarsProps) => {
  return (
    <article className={clsx("surface", "surface--glass", styles.section)}>
      <div className={styles.header}>
        <div className={styles.heading}>
          <h2 className={styles.title}>{section.title}</h2>
          <p className={styles.description}>{section.description}</p>
        </div>

        <Button leftIcon={<Icon name="plus" />} onClick={onCreate} size="sm" variant="secondary">
          {section.addLabel}
        </Button>
      </div>

      {feedback ? (
        <div className={clsx(styles.notice, styles[`notice--${feedback.tone}`])}>
          {feedback.message}
        </div>
      ) : null}

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
          <p className={styles.stateTitle}>Загружаем список автомобилей</p>
          <p className={styles.stateDescription}>Получаем актуальные данные вашего гаража.</p>
        </div>
      ) : errorMessage ? (
        <div className={styles.state}>
          <p className={styles.stateTitle}>Не удалось загрузить автомобили</p>
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
                <div
                  className={clsx(styles.thumb, styles[`thumb--${item.accent}`], {
                    [styles["thumb--image"]]: Boolean(item.photoUrl),
                  })}
                  style={item.photoUrl ? { backgroundImage: `url(${item.photoUrl})` } : undefined}
                >
                  {!item.photoUrl ? <Icon name="car" /> : null}
                </div>

                <div className={styles.cardHead}>
                  <div className={styles.cardTop}>
                    <h3 className={styles.cardTitle}>{item.name}</h3>
                    <span className={clsx(styles.badge, styles[`badge--${item.accent}`])}>
                      В гараже
                    </span>
                  </div>

                  <p className={styles.cardPlate}>{item.plate}</p>
                </div>
              </div>

              <div className={styles.details}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Год выпуска</span>
                  <span className={styles.detailValue}>{item.year}</span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Пробег</span>
                  <span className={styles.detailValue}>{item.mileage}</span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>VIN</span>
                  <span className={styles.detailValue}>{item.vin}</span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Добавлен в профиль</span>
                  <span className={styles.detailValue}>{item.createdAt}</span>
                </div>
              </div>

              <div className={styles.actions}>
                <Button onClick={() => onEdit?.(item.id)} size="sm" variant="secondary">
                  Редактировать
                </Button>
                <Button onClick={() => onDelete?.(item.id)} size="sm" variant="ghost">
                  Удалить
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <Empty
          action={
            onCreate ? (
              <Button
                leftIcon={<Icon name="plus" />}
                onClick={onCreate}
                size="sm"
                variant="secondary"
              >
                Добавить первый автомобиль
              </Button>
            ) : null
          }
          description="В вашем гараже пока нет автомобилей. Добавьте первую машину, и здесь появятся карточки с данными и управлением."
          title="Гараж пока пуст"
        />
      )}
    </article>
  );
};

export default ProfileCars;
