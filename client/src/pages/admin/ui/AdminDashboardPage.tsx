import clsx from "clsx";
import { createAdminStats } from "@/entities/admin/model";
import { useAdminOrdersQuery } from "@/entities/order";
import { useAdminReviewsQuery } from "@/entities/review";
import { useAdminServicesQuery } from "@/entities/service";
import Button from "@/shared/ui/Button";
import Icon from "@/shared/ui/Icon";
import AdminStats from "@/widgets/admin-stats";
import styles from "./AdminDashboardPage.module.scss";

const AdminDashboardPage = () => {
  const ordersQuery = useAdminOrdersQuery();
  const reviewsQuery = useAdminReviewsQuery();
  const servicesQuery = useAdminServicesQuery();

  const isLoading = ordersQuery.isPending || reviewsQuery.isPending || servicesQuery.isPending;
  const isError = ordersQuery.isError || reviewsQuery.isError || servicesQuery.isError;

  const handleRetry = () => {
    void Promise.all([ordersQuery.refetch(), reviewsQuery.refetch(), servicesQuery.refetch()]);
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
          Подтягиваем реальные показатели по заявкам, отзывам и услугам для административной сводки.
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
    services: servicesQuery.data ?? [],
  });

  return <AdminStats items={stats} />;
};

export default AdminDashboardPage;
