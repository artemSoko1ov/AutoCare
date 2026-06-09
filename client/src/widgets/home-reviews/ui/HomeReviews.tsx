import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { createHomeReviewItems, useReviewsQuery } from "@/entities/review";
import { ServiceIcon } from "@/entities/service";
import Button from "@/shared/ui/Button";
import Empty from "@/shared/ui/Empty";
import Icon from "@/shared/ui/Icon";
import Section from "@/shared/ui/Section";
import styles from "./HomeReviews.module.scss";

const HomeReviews = () => {
  const { data = [], isError, isLoading, refetch } = useReviewsQuery(9);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const reviews = useMemo(() => createHomeReviewItems(data), [data]);

  useEffect(() => {
    const trackElement = trackRef.current;

    if (!trackElement || isLoading || reviews.length === 0) {
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
  }, [isLoading, reviews.length]);

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
            Каталог услуг
            <span className={styles.catalogLinkIcon}>
              <Icon name="chevron-right" />
            </span>
          </Link>

          <div className={styles.navigation}>
            <Button
              aria-label="Показать предыдущие отзывы"
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
              aria-label="Показать следующие отзывы"
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
      description="Показываем живые отзывы клиентов, чтобы было проще понять формат работы, уровень сервиса и впечатления после обращения."
      title="Отзывы клиентов"
      titleAs="h2"
      titleSize="h2"
    >
      {isLoading ? (
        <div className={styles.slider}>
          <div className={styles.track}>
            {Array.from({ length: 3 }, (_, index) => (
              <article className={clsx("surface", styles.card, styles.cardSkeleton)} key={index}>
                <div className={styles.skeletonHeader}>
                  <div className={styles.skeletonAuthor}>
                    <div className={styles.skeletonAvatar} />
                    <div className={styles.skeletonAuthorLines}>
                      <div className={styles.skeletonAuthorName} />
                      <div className={styles.skeletonAuthorMeta} />
                    </div>
                  </div>
                  <div className={styles.skeletonIcon} />
                </div>

                <div className={styles.skeletonMeta}>
                  <div className={styles.skeletonChip} />
                  <div className={styles.skeletonChip} />
                </div>

                <div className={styles.skeletonTitle} />
                <div className={styles.skeletonText} />
                <div className={styles.skeletonText} />
                <div className={styles.skeletonTextShort} />
                <div className={styles.skeletonFooter} />
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
                leftIcon={<Icon name="star" />}
                onClick={() => {
                  void refetch();
                }}
                size="sm"
                variant="secondary"
              >
                Повторить загрузку
              </Button>
            }
            description="Список отзывов временно недоступен. Можно повторить запрос и снова получить данные с сервера."
            icon="star"
            title="Не удалось загрузить отзывы"
          />
        </article>
      ) : null}

      {!isLoading && !isError && reviews.length === 0 ? (
        <article className={clsx("surface", styles.stateCard)}>
          <Empty
            description="Первые отзывы клиентов скоро появятся на главной странице после завершенных обращений."
            icon="star"
            title="Отзывы скоро появятся"
          />
        </article>
      ) : null}

      {!isLoading && !isError && reviews.length > 0 ? (
        <div className={styles.slider}>
          <div className={styles.track} ref={trackRef}>
            {reviews.map((review) => (
              <Link className={clsx("surface", styles.card)} key={review.id} to={review.to}>
                <div className={styles.cardHeader}>
                  <div className={styles.authorBlock}>
                    <div
                      className={styles.avatar}
                      style={
                        review.authorAvatarUrl
                          ? { backgroundImage: `url(${review.authorAvatarUrl})` }
                          : undefined
                      }
                    >
                      {!review.authorAvatarUrl ? review.author.slice(0, 1) : null}
                    </div>

                    <div className={styles.authorMeta}>
                      <span className={styles.author}>{review.author}</span>
                      <span className={styles.car}>{review.car}</span>
                    </div>
                  </div>

                  <ServiceIcon className={styles.serviceIcon} src={review.serviceIconPath} />
                </div>

                <div className={styles.cardMeta}>
                  <span className={styles.category}>{review.serviceCategory}</span>
                  <span className={styles.rating}>
                    <Icon name="star" />
                    {review.rating}.0
                  </span>
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.title}>{review.serviceTitle}</h3>
                  <p className={styles.text}>{review.text}</p>
                </div>

                <div className={styles.cardFooter}>
                  <span className={styles.date}>{review.date}</span>
                  <span className={styles.more}>
                    Подробнее
                    <Icon name="chevron-right" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </Section>
  );
};

export default HomeReviews;
