import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import clsx from "clsx";
import { formatServicePrice, useServiceQuery } from "@/entities/service";
import Button from "@/shared/ui/Button";
import Icon from "@/shared/ui/Icon";
import Section from "@/shared/ui/Section";
import styles from "./RequestCreatePage.module.scss";

const RequestCreatePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("serviceId") ?? undefined;
  const { data: service } = useServiceQuery(serviceId);

  const description = useMemo(() => {
    if (!service) {
      return "Страница создания заявки будет здесь. Пока мы подготовили только маршрут и базовый сценарий перехода.";
    }

    return `Вы выбрали услугу "${service.title}". Дальше здесь появится полноценная форма оформления заявки и выбор автомобиля.`;
  }, [service]);

  return (
    <Section
      bodyClassName={styles.content}
      className={clsx("page-shell", "page-shell--accent", styles.page)}
      description={description}
      title="Новая заявка"
      titleAs="h1"
      titleSize="h1"
    >
      <article className={clsx("surface", "surface--glass", styles.card)}>
        <div className={styles.cardHeader}>
          <span className={styles.cardIcon}>
            <Icon name="orders" />
          </span>
          <div className={styles.cardBody}>
            <h2 className={styles.cardTitle}>Форма заявки будет следующим этапом</h2>
            <p className={styles.cardText}>
              Маршрут уже рабочий: сюда попадает авторизованный пользователь после нажатия кнопки
              записи на странице услуги.
            </p>
          </div>
        </div>

        {service ? (
          <div className={styles.serviceCard}>
            <span className={styles.serviceLabel}>Выбранная услуга</span>
            <h3 className={styles.serviceTitle}>{service.title}</h3>
            <p className={styles.serviceMeta}>
              {service.category} · {service.durationLabel} · {formatServicePrice(service.priceFrom)}
            </p>
          </div>
        ) : null}

        <div className={styles.actions}>
          <Button
            onClick={() => {
              navigate("/services");
            }}
            size="sm"
            variant="secondary"
          >
            Вернуться к услугам
          </Button>
          <Button
            onClick={() => {
              navigate("/profile");
            }}
            size="sm"
            variant="ghost"
          >
            Перейти в профиль
          </Button>
        </div>
      </article>
    </Section>
  );
};

export default RequestCreatePage;
