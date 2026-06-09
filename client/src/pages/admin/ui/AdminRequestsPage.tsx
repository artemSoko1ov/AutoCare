import clsx from "clsx";
import { useAdminOrdersQuery } from "@/entities/order";
import Button from "@/shared/ui/Button";
import Icon from "@/shared/ui/Icon";
import AdminRequestsTable from "@/widgets/admin-requests-table";
import styles from "./AdminRequestsPage.module.scss";

const AdminRequestsPage = () => {
  const { data = [], isError, isLoading, refetch } = useAdminOrdersQuery();

  if (isLoading) {
    return (
      <article className={clsx("surface", "surface--glass", styles.stateCard)}>
        <div className={styles.stateHeader}>
          <span className={styles.stateIcon}>
            <Icon name="orders" />
          </span>
          <h2 className={styles.stateTitle}>Загружаем заявки</h2>
        </div>

        <p className={styles.stateDescription}>
          Получаем актуальный список обращений для админки и подготовки изменений.
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
          <h2 className={styles.stateTitle}>Не удалось загрузить заявки</h2>
        </div>

        <p className={styles.stateDescription}>
          Сервер не отдал список заявок. Повторите запрос, и таблица снова подтянет актуальные
          данные.
        </p>

        <Button
          leftIcon={<Icon name="orders" />}
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

  return <AdminRequestsTable orders={data} />;
};

export default AdminRequestsPage;
