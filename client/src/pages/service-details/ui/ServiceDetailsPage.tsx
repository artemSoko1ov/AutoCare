import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import clsx from "clsx";
import { useAppSelector } from "@app/providers/store/hooks";
import { formatServicePrice, ServiceIcon, useServiceQuery } from "@/entities/service";
import Button from "@/shared/ui/Button";
import Empty from "@/shared/ui/Empty";
import Icon from "@/shared/ui/Icon";
import Section from "@/shared/ui/Section";
import ServiceReviews, { type ServiceReviewItem } from "@/widgets/service-reviews";
import styles from "./ServiceDetailsPage.module.scss";

const fallbackIncludedItems = [
  "Индивидуальный разбор задачи под ваш автомобиль и сценарий обращения.",
  "Прозрачные этапы работ без скрытых услуг и непонятных формулировок.",
  "Рекомендации по следующему шагу после выполнения услуги.",
];

const fallbackWorkflowSteps = [
  "Сначала уточняем задачу и согласовываем удобный формат обращения.",
  "Потом выполняем услугу и фиксируем важные детали по автомобилю.",
  "В конце даем понятный итог и рекомендации по дальнейшим действиям.",
];

const createMockReviews = (serviceTitle: string): ServiceReviewItem[] => [
  {
    id: "review-1",
    author: "Алексей Смирнов",
    car: "Toyota Camry, 2019",
    date: "15 мая 2026",
    rating: 5,
    text: `Обращался на услугу "${serviceTitle}". Все объяснили спокойно и по делу, после визита стало понятно, что делать с автомобилем дальше.`,
  },
  {
    id: "review-2",
    author: "Марина Волкова",
    car: "Kia Rio, 2021",
    date: "4 мая 2026",
    rating: 5,
    text: "Понравился подход: без навязывания, с конкретикой по стоимости и срокам. Отчет и рекомендации были понятными даже без технической подготовки.",
  },
  {
    id: "review-3",
    author: "Илья Козлов",
    car: "Skoda Octavia, 2018",
    date: "27 апреля 2026",
    rating: 4,
    text: "Хороший сервис и внятная коммуникация. Особенно удобно, что сразу подсказали приоритетные моменты и не перегружали лишними деталями.",
  },
];

const ServiceDetailsPage = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();
  const { isAuth } = useAppSelector((state) => state.session);
  const { data: service, isError, isLoading, refetch } = useServiceQuery(serviceId);

  const includedItems = useMemo(() => {
    if (!service || service.includedItems.length === 0) {
      return fallbackIncludedItems;
    }

    return service.includedItems;
  }, [service]);

  const workflowSteps = useMemo(() => {
    if (!service || service.workflowSteps.length === 0) {
      return fallbackWorkflowSteps;
    }

    return service.workflowSteps;
  }, [service]);

  const reviews = useMemo(() => {
    return createMockReviews(service?.title ?? "этой услуге");
  }, [service?.title]);

  const handleBookClick = () => {
    if (!service) {
      return;
    }

    const requestPath = `/requests/new?serviceId=${service.id}`;

    if (isAuth) {
      navigate(requestPath);
      return;
    }

    navigate("/login", {
      state: {
        from: requestPath,
      },
    });
  };

  if (isLoading) {
    return (
      <Section
        bodyClassName={styles.content}
        className={clsx("page-shell", "page-shell--accent", styles.page)}
        description="Подготавливаем подробную информацию по выбранной услуге."
        title="Загрузка услуги"
        titleAs="h1"
        titleSize="h1"
      >
        <article className={clsx("surface", "surface--glass", styles.stateCard)}>
          <div className={styles.stateHeader}>
            <span className={styles.stateIcon}>
              <Icon name="wrench" />
            </span>
            <h2 className={styles.stateTitle}>Загружаем информацию об услуге</h2>
          </div>
          <p className={styles.stateDescription}>
            Получаем описание, стоимость и рекомендации, чтобы показать полную карточку услуги.
          </p>
        </article>
      </Section>
    );
  }

  if (isError || !service) {
    return (
      <Section
        bodyClassName={styles.content}
        className={clsx("page-shell", "page-shell--accent", styles.page)}
        description="Похоже, эта услуга недоступна или была скрыта из публичного каталога."
        title="Услуга не найдена"
        titleAs="h1"
        titleSize="h1"
      >
        <article className={clsx("surface", "surface--glass", styles.stateCard)}>
          <Empty
            action={
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
                <Button
                  onClick={() => {
                    navigate("/services");
                  }}
                  size="sm"
                  variant="ghost"
                >
                  Вернуться в каталог
                </Button>
              </div>
            }
            compact
            description="Попробуйте открыть каталог услуг и выбрать другую позицию или повторить запрос."
            icon="support"
            title="Не удалось открыть страницу услуги"
          />
        </article>
      </Section>
    );
  }

  return (
    <Section
      bodyClassName={styles.content}
      className={clsx("page-shell", "page-shell--accent", styles.page)}
      description={service.summary}
      title={service.title}
      titleAs="h1"
      titleSize="h1"
    >
      <div className={styles.heroGrid}>
        <article className={clsx("surface", "surface--glass", styles.overviewCard)}>
          <div className={styles.overviewHeader}>
            <ServiceIcon className={styles.heroIcon} src={service.iconPath} />

            <div className={styles.heroMeta}>
              <span className={styles.category}>{service.category}</span>
              <span className={styles.duration}>{service.durationLabel}</span>
            </div>
          </div>

          <p className={styles.lead}>{service.summary}</p>

          <div className={styles.factsGrid}>
            <div className={styles.factCard}>
              <span className={styles.factIcon}>
                <Icon name="wallet" />
              </span>
              <div className={styles.factBody}>
                <span className={styles.factLabel}>Стоимость</span>
                <strong className={styles.factValue}>
                  {formatServicePrice(service.priceFrom)}
                </strong>
              </div>
            </div>

            <div className={styles.factCard}>
              <span className={styles.factIcon}>
                <Icon name="clock" />
              </span>
              <div className={styles.factBody}>
                <span className={styles.factLabel}>Ориентир по времени</span>
                <strong className={styles.factValue}>{service.durationLabel}</strong>
              </div>
            </div>

            <div className={styles.factCard}>
              <span className={styles.factIcon}>
                <Icon name="shield" />
              </span>
              <div className={styles.factBody}>
                <span className={styles.factLabel}>Формат</span>
                <strong className={styles.factValue}>Прозрачный и понятный процесс</strong>
              </div>
            </div>
          </div>
        </article>

        <aside className={clsx("surface", "surface--glass", styles.ctaCard)}>
          <div className={styles.ctaBody}>
            <h2 className={styles.ctaTitle}>Готовы записаться на услугу?</h2>
            <p className={styles.ctaText}>
              Оформление заявки откроет следующий шаг с выбранной услугой и привязкой к вашему
              автомобилю.
            </p>
          </div>

          <Button
            fullWidth
            onClick={handleBookClick}
            rightIcon={<Icon name="chevron-right" />}
            size="lg"
            variant="primary"
          >
            Записаться
          </Button>
        </aside>
      </div>

      <div className={styles.infoGrid}>
        <article className={clsx("surface", "surface--glass", styles.infoCard)}>
          <h2 className={styles.infoTitle}>Что входит в услугу</h2>
          <ul className={styles.infoList}>
            {includedItems.map((item) => (
              <li className={styles.infoItem} key={item}>
                <span className={styles.infoItemIcon}>
                  <Icon name="check-circle" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className={clsx("surface", "surface--glass", styles.infoCard)}>
          <h2 className={styles.infoTitle}>Как проходит работа</h2>
          <ol className={styles.stepsList}>
            {workflowSteps.map((item, index) => (
              <li className={styles.stepItem} key={item}>
                <span className={styles.stepIndex}>{index + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </article>
      </div>

      <div className={styles.reviewsSection}>
        <div className={styles.reviewsHeader}>
          <div>
            <h2 className={styles.reviewsTitle}>Отзывы по услуге</h2>
            <p className={styles.reviewsDescription}>
              Пока это моковые отзывы, но секция уже готова под подключение реальных данных.
            </p>
          </div>
        </div>

        <ServiceReviews items={reviews} />
      </div>
    </Section>
  );
};

export default ServiceDetailsPage;
