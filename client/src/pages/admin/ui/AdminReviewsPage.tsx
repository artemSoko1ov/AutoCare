import clsx from "clsx";
import { useAdminReviewsQuery } from "@/entities/review";
import Button from "@/shared/ui/Button";
import Icon from "@/shared/ui/Icon";
import AdminReviewsTable from "@/widgets/admin-reviews-table";
import styles from "./AdminReviewsPage.module.scss";

const AdminReviewsPage = () => {
  const { data = [], isError, isLoading, refetch } = useAdminReviewsQuery();

  if (isLoading) {
    return (
      <article className={clsx("surface", "surface--glass", styles.stateCard)}>
        <div className={styles.stateHeader}>
          <span className={styles.stateIcon}>
            <Icon name="star" />
          </span>
          <h2 className={styles.stateTitle}>Загружаем отзывы</h2>
        </div>

        <p className={styles.stateDescription}>
          Получаем актуальный список отзывов для админки и подготовки модерации.
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
          <h2 className={styles.stateTitle}>Не удалось загрузить отзывы</h2>
        </div>

        <p className={styles.stateDescription}>
          Сервер не отдал административный список отзывов. Повторите запрос, и таблица снова
          подтянет актуальные данные.
        </p>

        <Button
          leftIcon={<Icon name="star" />}
          onClick={() => {
            void refetch();
          }}
          size="sm"
          variant="secondary"
        >
          Повторить загрузку
        </Button>
      </article>
    );
  }

  return <AdminReviewsTable reviews={data} />;
};

export default AdminReviewsPage;
