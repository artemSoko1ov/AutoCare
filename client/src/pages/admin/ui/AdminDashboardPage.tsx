import clsx from "clsx";
import { createAdminStats } from "@/entities/admin/model";
import { useAdminOrdersQuery } from "@/entities/order";
import { useAdminReviewsQuery } from "@/entities/review";
import Button from "@/shared/ui/Button";
import Icon from "@/shared/ui/Icon";
import AdminStats from "@/widgets/admin-stats";
import styles from "./AdminDashboardPage.module.scss";

const AdminDashboardPage = () => {
  const ordersQuery = useAdminOrdersQuery();
  const reviewsQuery = useAdminReviewsQuery();

  const isLoading = ordersQuery.isPending || reviewsQuery.isPending;
  const isError = ordersQuery.isError || reviewsQuery.isError;

  const handleRetry = () => {
    void Promise.all([ordersQuery.refetch(), reviewsQuery.refetch()]);
  };

  if (isLoading) {
    return (
      <article className={clsx("surface", "surface--glass", styles.stateCard)}>
        <div className={styles.stateHeader}>
          <span className={styles.stateIcon}>
            <Icon name="briefcase" />
          </span>
          <h2 className={styles.stateTitle}>Загружаем дашборд</h2>
        </div>

        <p className={styles.stateDescription}>
          Подтягиваем реальные показатели по заявкам и отзывам для административной сводки.
        </p>
      </article>
    );
  }

  if (isError) {
    return (
      <article className={clsx("surface", "surface--glass", styles.stateCard)}>
        <div className={styles.stateHeader}>
          <span className={styles.stateIcon}>
            <Icon name="support" />
          </span>
          <h2 className={styles.stateTitle}>Не удалось загрузить дашборд</h2>
        </div>

        <p className={styles.stateDescription}>
          Одна или несколько административных сводок не загрузились с сервера. Повторите запрос, и
          карточки снова подтянут актуальные значения.
        </p>

        <Button
          leftIcon={<Icon name="briefcase" />}
          onClick={handleRetry}
          size="sm"
          variant="secondary"
        >
          Повторить загрузку
        </Button>
      </article>
    );
  }

  const stats = createAdminStats({
    orders: ordersQuery.data ?? [],
    reviews: reviewsQuery.data ?? [],
  });

  return <AdminStats items={stats} />;
};

export default AdminDashboardPage;
