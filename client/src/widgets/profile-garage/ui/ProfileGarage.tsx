import clsx from "clsx";
import { NavLink } from "react-router-dom";
import type { ProfileGarageSection } from "@/entities/car";
import type { GarageFeedback } from "@/features/car/manage";
import Button from "@/shared/ui/Button";
import Empty from "@/shared/ui/Empty";
import Icon from "@/shared/ui/Icon";
import styles from "./ProfileGarage.module.scss";

type ProfileGarageProps = {
  section: ProfileGarageSection;
  isLoading?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
  onCreate?: () => void;
  feedback?: GarageFeedback | null;
};

const ProfileGarage = ({
  section,
  isLoading = false,
  errorMessage = null,
  onRetry,
  onCreate,
  feedback = null,
}: ProfileGarageProps) => {
  return (
    <div className={clsx("surface", "surface--glass", styles.card)}>
      <div className={styles.header}>
        <h2 className={styles.title}>{section.title}</h2>
        {section.actionTo ? (
          <NavLink className={styles.link} to={section.actionTo}>
            {section.actionLabel}
          </NavLink>
        ) : (
          <button className={styles.link} type="button">
            {section.actionLabel}
          </button>
        )}
      </div>

      {feedback ? (
        <div className={clsx(styles.notice, styles[`notice--${feedback.tone}`])}>
          {feedback.message}
        </div>
      ) : null}

      {isLoading ? (
        <div className={styles.state}>
          <p className={styles.stateTitle}>Загружаем автомобили</p>
          <p className={styles.stateDescription}>Подтягиваем ваш гараж из профиля.</p>
        </div>
      ) : errorMessage ? (
        <div className={styles.state}>
          <p className={styles.stateTitle}>Не удалось загрузить гараж</p>
          <p className={styles.stateDescription}>{errorMessage}</p>
          {onRetry ? (
            <Button className={styles.stateAction} onClick={onRetry} size="sm" variant="secondary">
              Повторить
            </Button>
          ) : null}
        </div>
      ) : section.items.length > 0 ? (
        <div className={styles.list}>
          {section.items.map((item) => (
            <div className={styles.item} key={item.id}>
              <div className={clsx(styles.thumb, styles[`thumb--${item.accent}`])}>
                <Icon name="car" />
              </div>

              <div className={styles.body}>
                <h3 className={styles.itemTitle}>{item.name}</h3>
                <p className={styles.itemMeta}>{item.plate}</p>
                <p className={styles.itemDetails}>{item.details}</p>
              </div>

              {section.actionTo ? (
                <NavLink
                  aria-label={`Открыть полный раздел для ${item.name}`}
                  className={styles.more}
                  to={section.actionTo}
                >
                  <Icon name="more" />
                </NavLink>
              ) : (
                <button className={styles.more} type="button">
                  <Icon name="more" />
                </button>
              )}
            </div>
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
                Добавить автомобиль
              </Button>
            ) : null
          }
          compact
          description="После добавления автомобиля он появится в этом блоке и будет доступен в полном разделе гаража."
          title="Автомобилей пока нет"
        />
      )}

      {!isLoading && !errorMessage && section.items.length > 0 ? (
        <button className={styles.addButton} onClick={onCreate} type="button">
          <Icon name="plus" />
          <span>{section.addLabel}</span>
        </button>
      ) : null}
    </div>
  );
};

export default ProfileGarage;
