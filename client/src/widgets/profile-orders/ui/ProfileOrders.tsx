import clsx from "clsx";
import { NavLink } from "react-router-dom";
import type { ProfileOrdersSection } from "@/entities/order";
import Button from "@/shared/ui/Button";
import Empty from "@/shared/ui/Empty";
import Icon from "@/shared/ui/Icon";
import styles from "./ProfileOrders.module.scss";

type ProfileOrdersProps = {
  section: ProfileOrdersSection;
  isLoading?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
};

const ProfileOrders = ({
  section,
  isLoading = false,
  errorMessage = null,
  onRetry,
}: ProfileOrdersProps) => {
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

      {isLoading ? (
        <div className={styles.state}>
          <p className={styles.stateTitle}>Загружаем заявки</p>
          <p className={styles.stateDescription}>Подтягиваем ваши последние обращения в сервис.</p>
        </div>
      ) : errorMessage ? (
        <div className={styles.state}>
          <p className={styles.stateTitle}>Не удалось загрузить заявки</p>
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
            <NavLink className={styles.item} key={item.id} to={`/profile/requests/${item.id}`}>
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
            </NavLink>
          ))}
        </div>
      ) : (
        <Empty
          compact
          description="После первой записи в сервис ваши обращения появятся в этом блоке."
          icon="orders"
          title="Заявок пока нет"
        />
      )}
    </div>
  );
};

export default ProfileOrders;
