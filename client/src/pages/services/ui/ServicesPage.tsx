import clsx from "clsx";
import { useServicesQuery } from "@/entities/service";
import Button from "@/shared/ui/Button";
import Icon from "@/shared/ui/Icon";
import Section from "@/shared/ui/Section";
import ServicesCatalog from "@/widgets/services-catalog";
import styles from "./ServicesPage.module.scss";

const ServicesPage = () => {
  const { data = [], isError, isLoading, refetch } = useServicesQuery();

  return (
    <Section
      bodyClassName={styles.content}
      className={clsx("page-shell", "page-shell--accent", styles.page)}
      description="Подберите подходящую услугу для диагностики, сопровождения сделки или регулярного обслуживания автомобиля."
      title="Услуги"
      titleAs="h1"
      titleSize="h1"
    >
      {isLoading ? (
        <article className={clsx("surface", "surface--glass", styles.stateCard)}>
          <div className={styles.stateHeader}>
            <span className={styles.stateIcon}>
              <Icon name="wrench" />
            </span>
            <h2 className={styles.stateTitle}>Загружаем каталог услуг</h2>
          </div>

          <p className={styles.stateDescription}>
            Получаем актуальные предложения сервиса, чтобы показать только активные позиции.
          </p>
        </article>
      ) : null}

      {!isLoading && isError ? (
        <article className={clsx("surface", "surface--glass", styles.stateCard)}>
          <div className={styles.stateHeader}>
            <span className={styles.stateIcon}>
              <Icon name="support" />
            </span>
            <h2 className={styles.stateTitle}>Не удалось загрузить услуги</h2>
          </div>

          <p className={styles.stateDescription}>
            Каталог временно недоступен. Можно повторить запрос и снова получить данные с сервера.
          </p>

          <div className={styles.stateActions}>
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
          </div>
        </article>
      ) : null}

      {!isLoading && !isError ? <ServicesCatalog services={data} /> : null}
    </Section>
  );
};

export default ServicesPage;
