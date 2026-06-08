import clsx from "clsx";
import { useAdminServicesQuery } from "@/entities/service";
import Button from "@/shared/ui/Button";
import Icon from "@/shared/ui/Icon";
import AdminServicesTable from "@/widgets/admin-services-table";
import styles from "./AdminServicesPage.module.scss";

const AdminServicesPage = () => {
  const { data = [], isError, isLoading, refetch } = useAdminServicesQuery();

  if (isLoading) {
    return (
      <article className={clsx("surface", "surface--glass", styles.stateCard)}>
        <div className={styles.stateHeader}>
          <span className={styles.stateIcon}>
            <Icon name="wrench" />
          </span>
          <h2 className={styles.stateTitle}>Загружаем услуги</h2>
        </div>

        <p className={styles.stateDescription}>
          Получаем актуальный список услуг для админки и подготовки изменений.
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
          <h2 className={styles.stateTitle}>Не удалось загрузить услуги</h2>
        </div>

        <p className={styles.stateDescription}>
          Сервер не отдал административный список услуг. Повторите запрос, и таблица снова подтянет
          актуальные данные.
        </p>

        <Button
          leftIcon={<Icon name="wrench" />}
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

  return <AdminServicesTable services={data} />;
};

export default AdminServicesPage;
