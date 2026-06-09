import type { ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import clsx from "clsx";
import { useCarsQuery } from "@/entities/car";
import { useServiceQuery } from "@/entities/service";
import { OrderCreateForm } from "@/features/order/create";
import Button from "@/shared/ui/Button";
import Empty from "@/shared/ui/Empty";
import Icon from "@/shared/ui/Icon";
import Section from "@/shared/ui/Section";
import PageBreadcrumbs from "@/widgets/page-breadcrumbs";
import styles from "./RequestCreatePage.module.scss";

const pageTitle = "Оформление заявки";
const pageDescription =
  "Выберите автомобиль из гаража, укажите удобное время посещения и оставьте комментарий. Мы свяжемся с вами для подтверждения записи.";

const RequestCreatePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("serviceId") ?? undefined;
  const serviceQuery = useServiceQuery(serviceId);
  const carsQuery = useCarsQuery();

  const service = serviceQuery.data;
  const cars = carsQuery.data ?? [];
  const isLoading = serviceQuery.isLoading || carsQuery.isLoading;
  const isError = serviceQuery.isError || carsQuery.isError;

  const renderStateSection = (content: ReactNode) => (
    <Section
      breadcrumbs={<PageBreadcrumbs />}
      bodyClassName={styles.content}
      className={clsx("page-shell", "page-shell--accent", styles.page)}
      description={pageDescription}
      title={pageTitle}
      titleAs="h1"
      titleSize="h1"
    >
      {content}
    </Section>
  );

  if (!serviceId) {
    return renderStateSection(
      <article className={clsx("surface", "surface--glass", styles.stateCard)}>
        <Empty
          action={
            <div className={styles.stateActions}>
              <Button
                onClick={() => {
                  navigate("/services");
                }}
                size="sm"
              >
                Выбрать услугу
              </Button>
            </div>
          }
          description="Перейдите в каталог, откройте нужную услугу и начните оформление оттуда."
          icon="wrench"
          title="Услуга не выбрана"
        />
      </article>,
    );
  }

  if (isLoading) {
    return renderStateSection(
      <article className={clsx("surface", "surface--glass", styles.stateCard)}>
        <div className={styles.stateHeader}>
          <span className={styles.stateIcon}>
            <Icon name="orders" />
          </span>
          <h2 className={styles.stateTitle}>Подготавливаем форму заявки</h2>
        </div>

        <p className={styles.stateDescription}>
          Загружаем выбранную услугу и ваш гараж, чтобы сразу подставить актуальные данные.
        </p>
      </article>,
    );
  }

  if (isError) {
    return renderStateSection(
      <article className={clsx("surface", "surface--glass", styles.stateCard)}>
        <div className={styles.stateHeader}>
          <span className={styles.stateIcon}>
            <Icon name="support" />
          </span>
          <h2 className={styles.stateTitle}>Не удалось подготовить заявку</h2>
        </div>

        <p className={styles.stateDescription}>
          Мы не смогли загрузить услугу или список автомобилей. Повторите запрос, и форма снова
          подтянет актуальные данные.
        </p>

        <div className={styles.stateActions}>
          <Button
            leftIcon={<Icon name="orders" />}
            onClick={() => {
              void Promise.all([serviceQuery.refetch(), carsQuery.refetch()]);
            }}
            size="sm"
            variant="secondary"
          >
            Повторить загрузку
          </Button>
          <Button
            onClick={() => {
              navigate("/services");
            }}
            size="sm"
            variant="ghost"
          >
            Вернуться к услугам
          </Button>
        </div>
      </article>,
    );
  }

  if (!service) {
    return renderStateSection(
      <article className={clsx("surface", "surface--glass", styles.stateCard)}>
        <Empty
          action={
            <div className={styles.stateActions}>
              <Button
                onClick={() => {
                  navigate("/services");
                }}
                size="sm"
              >
                Открыть каталог услуг
              </Button>
            </div>
          }
          description="Похоже, услуга больше недоступна или ссылка устарела. Выберите актуальную позицию из каталога."
          icon="wrench"
          title="Услуга не найдена"
        />
      </article>,
    );
  }

  if (cars.length === 0) {
    return renderStateSection(
      <article className={clsx("surface", "surface--glass", styles.stateCard)}>
        <Empty
          action={
            <div className={styles.stateActions}>
              <Button
                onClick={() => {
                  navigate("/profile/cars");
                }}
                size="sm"
              >
                Перейти в мой гараж
              </Button>
              <Button
                onClick={() => {
                  navigate("/services");
                }}
                size="sm"
                variant="secondary"
              >
                Вернуться к услугам
              </Button>
            </div>
          }
          description="Перед созданием заявки нужно добавить хотя бы один автомобиль в гараж. После этого форма сразу станет доступной."
          icon="car"
          title="В гараже пока нет автомобилей"
        />
      </article>,
    );
  }

  return (
    <Section
      breadcrumbs={<PageBreadcrumbs />}
      bodyClassName={styles.content}
      className={clsx("page-shell", "page-shell--accent", styles.page)}
      description={pageDescription}
      title={pageTitle}
      titleAs="h1"
      titleSize="h1"
    >
      <OrderCreateForm cars={cars} service={service} />
    </Section>
  );
};

export default RequestCreatePage;
