import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { ServiceIcon, useServicesQuery } from "@/entities/service";
import Button from "@/shared/ui/Button";
import Empty from "@/shared/ui/Empty";
import Icon from "@/shared/ui/Icon";
import Section from "@/shared/ui/Section";
import styles from "./HomeServices.module.scss";

const HomeServices = () => {
  const { data = [], isError, isLoading, refetch } = useServicesQuery();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const services = useMemo(() => {
    return data.slice(0, 12);
  }, [data]);

  useEffect(() => {
    const trackElement = trackRef.current;

    if (!trackElement || isLoading || services.length === 0) {
      setCanScrollPrev(false);
      setCanScrollNext(false);
      return;
    }

    const updateScrollState = () => {
      const maxScrollLeft = trackElement.scrollWidth - trackElement.clientWidth;
      const nextCanScrollPrev = trackElement.scrollLeft > 8;
      const nextCanScrollNext = trackElement.scrollLeft < maxScrollLeft - 8;

      setCanScrollPrev(nextCanScrollPrev);
      setCanScrollNext(nextCanScrollNext);
    };

    updateScrollState();

    trackElement.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      trackElement.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [isLoading, services.length]);

  const handleSlide = (direction: "prev" | "next") => {
    const trackElement = trackRef.current;

    if (!trackElement) {
      return;
    }

    const scrollOffset = trackElement.clientWidth * 0.92;

    trackElement.scrollBy({
      left: direction === "next" ? scrollOffset : -scrollOffset,
      behavior: "smooth",
    });
  };

  return (
    <Section
      actions={
        <div className={styles.headerActions}>
          <Link className={styles.catalogLink} to="/services">
            Все услуги
            <span className={styles.catalogLinkIcon}>
              <Icon name="chevron-right" />
            </span>
          </Link>

          <div className={styles.navigation}>
            <Button
              aria-label="Показать предыдущие услуги"
              className={styles.navigationButton}
              disabled={!canScrollPrev}
              onClick={() => {
                handleSlide("prev");
              }}
              size="sm"
              variant="secondary"
            >
              <span className={clsx(styles.navigationIcon, styles["navigationIcon--prev"])}>
                <Icon name="chevron-right" />
              </span>
            </Button>

            <Button
              aria-label="Показать следующие услуги"
              className={styles.navigationButton}
              disabled={!canScrollNext}
              onClick={() => {
                handleSlide("next");
              }}
              size="sm"
              variant="secondary"
            >
              <span className={styles.navigationIcon}>
                <Icon name="chevron-right" />
              </span>
            </Button>
          </div>
        </div>
      }
      bodyClassName={styles.content}
      className={styles.section}
      description="Подобрали востребованные услуги сервиса, чтобы вы могли быстро сориентироваться по форматам работ, срокам и стоимости."
      title="Услуги"
      titleAs="h2"
      titleSize="h2"
    >
      {isLoading ? (
        <div className={styles.slider}>
          <div className={styles.track}>
            {Array.from({ length: 3 }, (_, index) => (
              <article className={clsx("surface", styles.card, styles.cardSkeleton)} key={index}>
                <div className={styles.skeletonHeader} />
                <div className={styles.skeletonTitle} />
                <div className={styles.skeletonSummary} />
                <div className={styles.skeletonSummaryShort} />
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {!isLoading && isError ? (
        <article className={clsx("surface", styles.stateCard)}>
          <Empty
            action={
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
            }
            description="Каталог услуг временно недоступен. Можно повторить запрос и снова получить данные с сервера."
            icon="wrench"
            title="Не удалось загрузить услуги"
          />
        </article>
      ) : null}

      {!isLoading && !isError && services.length === 0 ? (
        <article className={clsx("surface", styles.stateCard)}>
          <Empty
            description="Список услуг уже готов к подключению и скоро появится на главной странице."
            icon="wrench"
            title="Услуги скоро появятся"
          />
        </article>
      ) : null}

      {!isLoading && !isError && services.length > 0 ? (
        <div className={styles.slider}>
          <div className={styles.track} ref={trackRef}>
            {services.map((service) => (
              <Link
                className={clsx("surface", styles.card)}
                key={service.id}
                to={`/services/${service.id}`}
              >
                <div className={styles.cardHeader}>
                  <ServiceIcon className={styles.serviceIcon} src={service.iconPath} />

                  <div className={styles.cardMeta}>
                    <span className={styles.category}>{service.category}</span>
                    <span className={styles.duration}>{service.durationLabel}</span>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.title}>{service.title}</h3>
                  <p className={styles.summary}>{service.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </Section>
  );
};

export default HomeServices;
