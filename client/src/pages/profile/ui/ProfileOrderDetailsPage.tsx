import { useNavigate, useParams } from "react-router-dom";
import clsx from "clsx";
import {
  formatOrderDateTime,
  formatOrderId,
  formatOrderMoney,
  formatOrderStatus,
  getOrderStatusTone,
  useOrderQuery,
} from "@/entities/order";
import Button from "@/shared/ui/Button";
import Empty from "@/shared/ui/Empty";
import Icon from "@/shared/ui/Icon";
import PageBreadcrumbs from "@/widgets/page-breadcrumbs";
import styles from "./ProfileOrderDetailsPage.module.scss";

const mileageFormatter = new Intl.NumberFormat("ru-RU");

const ProfileOrderDetailsPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const orderQuery = useOrderQuery(orderId);

  if (orderQuery.isLoading) {
    return (
      <article className={clsx("surface", "surface--glass", styles.card)}>
        <div className={styles.header}>
          <PageBreadcrumbs />
          <h2 className={styles.title}>Загружаем заявку</h2>
          <p className={styles.description}>
            Подтягиваем детали обращения, чтобы показать статус, автомобиль и выбранную услугу.
          </p>
        </div>
      </article>
    );
  }

  if (orderQuery.isError || !orderQuery.data) {
    return (
      <article className={clsx("surface", "surface--glass", styles.card)}>
        <PageBreadcrumbs />
        <Empty
          action={
            <div className={styles.actions}>
              <Button
                onClick={() => {
                  void orderQuery.refetch();
                }}
                size="sm"
                variant="secondary"
              >
                Повторить загрузку
              </Button>
              <Button
                onClick={() => {
                  navigate("/profile/requests");
                }}
                size="sm"
                variant="ghost"
              >
                Вернуться к заявкам
              </Button>
            </div>
          }
          compact
          description="Не удалось получить данные по выбранной заявке. Попробуйте открыть ее снова из списка."
          icon="support"
          title="Заявка не найдена"
        />
      </article>
    );
  }

  const order = orderQuery.data;

  return (
    <article className={clsx("surface", "surface--glass", styles.card)}>
      <div className={styles.header}>
        <PageBreadcrumbs />

        <div className={styles.heading}>
          <div className={styles.headingTop}>
            <h2 className={styles.title}>Заявка {formatOrderId(order.id)}</h2>
            <span
              className={clsx(styles.badge, styles[`badge--${getOrderStatusTone(order.status)}`])}
            >
              {formatOrderStatus(order.status)}
            </span>
          </div>

          <p className={styles.description}>
            Следите за текущим статусом заявки, временем визита и данными автомобиля.
          </p>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Создана</span>
          <strong className={styles.statValue}>{formatOrderDateTime(order.createdAt)}</strong>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Запланировано</span>
          <strong className={styles.statValue}>
            {order.scheduledFor ? formatOrderDateTime(order.scheduledFor) : "Согласуем отдельно"}
          </strong>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Стоимость</span>
          <strong className={styles.statValue}>
            {order.quotedPrice !== null
              ? formatOrderMoney(order.quotedPrice)
              : `от ${formatOrderMoney(order.service.priceFrom)}`}
          </strong>
        </div>
      </div>

      <div className={styles.grid}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <Icon name="wrench" />
            </span>
            <div>
              <h3 className={styles.sectionTitle}>Услуга</h3>
              <p className={styles.sectionSubtitle}>{order.service.title}</p>
            </div>
          </div>

          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Категория</span>
              <span className={styles.infoValue}>{order.service.category}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Ориентир по времени</span>
              <span className={styles.infoValue}>{order.service.durationLabel}</span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <Icon name="car" />
            </span>
            <div>
              <h3 className={styles.sectionTitle}>Автомобиль</h3>
              <p className={styles.sectionSubtitle}>
                {order.carSnapshot.brand} {order.carSnapshot.model}
              </p>
            </div>
          </div>

          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Госномер</span>
              <span className={styles.infoValue}>{order.carSnapshot.plateNumber}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Год выпуска</span>
              <span className={styles.infoValue}>{order.carSnapshot.year}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Пробег</span>
              <span className={styles.infoValue}>
                {mileageFormatter.format(order.carSnapshot.mileage)} км
              </span>
            </div>
          </div>
        </section>
      </div>

      <section className={styles.noteSection}>
        <h3 className={styles.sectionTitle}>Комментарий к заявке</h3>
        <p className={styles.noteText}>
          {order.notes || "Комментарий не был добавлен при оформлении заявки."}
        </p>
      </section>

      <div className={styles.actions}>
        <Button
          onClick={() => {
            navigate("/profile/requests");
          }}
          size="sm"
          variant="secondary"
        >
          Назад к списку заявок
        </Button>
      </div>
    </article>
  );
};

export default ProfileOrderDetailsPage;
