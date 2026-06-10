import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import clsx from "clsx";
import {
  formatOrderDateTime,
  formatOrderId,
  formatOrderMoney,
  formatOrderStatus,
  useOrderQuery,
} from "@/entities/order";
import { formatReviewDate, useMyReviewsQuery } from "@/entities/review";
import {
  ReviewFormModal,
  getCreateReviewFieldErrors,
  getReviewErrorMessage,
  getReviewFieldErrors,
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useUpdateReviewMutation,
  type ReviewFieldErrors,
} from "@/features/review/manage";
import Button from "@/shared/ui/Button";
import Empty from "@/shared/ui/Empty";
import Icon from "@/shared/ui/Icon";
import PageBreadcrumbs from "@/widgets/page-breadcrumbs";
import styles from "./ProfileOrderDetailsPage.module.scss";

const mileageFormatter = new Intl.NumberFormat("ru-RU");

type NoticeState = {
  text: string;
  tone: "success" | "info" | "error";
};

const ProfileOrderDetailsPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const orderQuery = useOrderQuery(orderId);
  const reviewsQuery = useMyReviewsQuery();
  const createReviewMutation = useCreateReviewMutation();
  const updateReviewMutation = useUpdateReviewMutation();
  const deleteReviewMutation = useDeleteReviewMutation();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewNotice, setReviewNotice] = useState<NoticeState | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewFieldErrors, setReviewFieldErrors] = useState<ReviewFieldErrors>({});

  if (orderQuery.isLoading) {
    return (
      <article className={clsx("surface", "surface--glass", styles.card)}>
        <div className={styles.header}>
          <PageBreadcrumbs />
          <h2 className={styles.title}>Загружаем заявку</h2>
          <p className={styles.description}>
            Подтягиваем детали обращения, чтобы показать статус, автомобиль и выбранную услугу.
          </p>
        </div>
      </article>
    );
  }

  if (orderQuery.isError || !orderQuery.data) {
    return (
      <article className={clsx("surface", "surface--glass", styles.card)}>
        <PageBreadcrumbs />
        <Empty
          action={
            <div className={styles.actions}>
              <Button
                onClick={() => {
                  void orderQuery.refetch();
                }}
                size="sm"
                variant="secondary"
              >
                Повторить загрузку
              </Button>
              <Button
                onClick={() => {
                  navigate("/profile/requests");
                }}
                size="sm"
                variant="ghost"
              >
                Вернуться к заявкам
              </Button>
            </div>
          }
          compact
          description="Не удалось получить данные по выбранной заявке. Попробуйте открыть ее снова из списка."
          icon="support"
          title="Заявка не найдена"
        />
      </article>
    );
  }

  const order = orderQuery.data;
  const orderReview = reviewsQuery.data?.find((review) => review.orderId === order.id) ?? null;
  const canReview = order.status === "completed";
  const isReviewSubmitting = createReviewMutation.isPending || updateReviewMutation.isPending;
  const orderBadgeTone = order.status === "completed" ? "success" : "warning";

  const clearReviewFieldError = (field: keyof ReviewFieldErrors) => {
    setReviewFieldErrors((currentState) => ({
      ...currentState,
      [field]: undefined,
    }));
    setReviewError(null);
  };

  const resetReviewFeedback = () => {
    setReviewError(null);
    setReviewFieldErrors({});
  };

  const handleReviewSubmit = async (values: { rating: number; comment: string }) => {
    resetReviewFeedback();
    setReviewNotice(null);

    try {
      if (orderReview) {
        await updateReviewMutation.mutateAsync({
          reviewId: orderReview.id,
          data: {
            rating: values.rating,
            comment: values.comment,
          },
        });

        setReviewNotice({
          text: "Отзыв обновлен.",
          tone: "info",
        });
      } else {
        await createReviewMutation.mutateAsync({
          orderId: order.id,
          rating: values.rating,
          comment: values.comment,
        });

        setReviewNotice({
          text: "Отзыв опубликован.",
          tone: "success",
        });
      }

      setIsReviewModalOpen(false);
      void reviewsQuery.refetch();
    } catch (error) {
      if (orderReview) {
        const { fieldErrors } = getReviewFieldErrors(error);
        setReviewFieldErrors(fieldErrors);
      } else {
        const { fieldErrors } = getCreateReviewFieldErrors(error);
        setReviewFieldErrors({
          rating: fieldErrors.rating,
          comment: fieldErrors.comment,
        });
      }

      setReviewError(getReviewErrorMessage(error));
    }
  };

  const handleReviewDelete = async () => {
    if (!orderReview) {
      return;
    }

    resetReviewFeedback();
    setReviewNotice(null);

    try {
      await deleteReviewMutation.mutateAsync(orderReview.id);
      setIsReviewModalOpen(false);
      setReviewNotice({
        text: "Отзыв удален.",
        tone: "success",
      });
      void reviewsQuery.refetch();
    } catch (error) {
      setReviewError(getReviewErrorMessage(error));
    }
  };

  return (
    <article className={clsx("surface", "surface--glass", styles.card)}>
      <div className={styles.header}>
        <PageBreadcrumbs />

        <div className={styles.heading}>
          <div className={styles.headingTop}>
            <h2 className={styles.title}>Заявка {formatOrderId(order.id)}</h2>
            <span className={clsx(styles.badge, styles[`badge--${orderBadgeTone}`])}>
              {formatOrderStatus(order.status)}
            </span>
          </div>

          <p className={styles.description}>
            Следите за текущим статусом заявки, временем визита и данными автомобиля.
          </p>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Создана</span>
          <strong className={styles.statValue}>{formatOrderDateTime(order.createdAt)}</strong>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Запланировано</span>
          <strong className={styles.statValue}>
            {order.scheduledFor ? formatOrderDateTime(order.scheduledFor) : "Согласуем отдельно"}
          </strong>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Стоимость</span>
          <strong className={styles.statValue}>
            {order.quotedPrice !== null
              ? formatOrderMoney(order.quotedPrice)
              : `от ${formatOrderMoney(order.service.priceFrom)}`}
          </strong>
        </div>
      </div>

      <div className={styles.grid}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <Icon name="wrench" />
            </span>
            <div>
              <h3 className={styles.sectionTitle}>Услуга</h3>
              <p className={styles.sectionSubtitle}>{order.service.title}</p>
            </div>
          </div>

          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Категория</span>
              <span className={styles.infoValue}>{order.service.category}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Ориентир по времени</span>
              <span className={styles.infoValue}>{order.service.durationLabel}</span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionIcon}>
              <Icon name="car" />
            </span>
            <div>
              <h3 className={styles.sectionTitle}>Автомобиль</h3>
              <p className={styles.sectionSubtitle}>
                {order.carSnapshot.brand} {order.carSnapshot.model}
              </p>
            </div>
          </div>

          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Госномер</span>
              <span className={styles.infoValue}>{order.carSnapshot.plateNumber}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Год выпуска</span>
              <span className={styles.infoValue}>{order.carSnapshot.year}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Пробег</span>
              <span className={styles.infoValue}>
                {mileageFormatter.format(order.carSnapshot.mileage)} км
              </span>
            </div>
          </div>
        </section>
      </div>

      <section className={styles.noteSection}>
        <h3 className={styles.sectionTitle}>Комментарий к заявке</h3>
        <p className={styles.noteText}>
          {order.notes || "Комментарий не был добавлен при оформлении заявки."}
        </p>
      </section>

      <section className={styles.reviewSection}>
        <div className={styles.reviewHeader}>
          <div>
            <h3 className={styles.sectionTitle}>Отзыв по заявке</h3>
            <p className={styles.reviewDescription}>
              После завершения заявки можно оставить отзыв, который появится в профиле, админке и на
              странице услуги.
            </p>
          </div>

          {canReview && !reviewsQuery.isError ? (
            <Button
              onClick={() => {
                resetReviewFeedback();
                setReviewNotice(null);
                setIsReviewModalOpen(true);
              }}
              size="sm"
              variant={orderReview ? "secondary" : "primary"}
            >
              {orderReview ? "Редактировать отзыв" : "Оставить отзыв"}
            </Button>
          ) : null}
        </div>

        {reviewNotice ? (
          <div className={clsx(styles.reviewNotice, styles[`reviewNotice--${reviewNotice.tone}`])}>
            {reviewNotice.text}
          </div>
        ) : null}

        {reviewsQuery.isPending ? (
          <p className={styles.reviewDescription}>
            Проверяем, оставляли ли вы отзыв по этой заявке.
          </p>
        ) : reviewsQuery.isError ? (
          <div className={styles.reviewActions}>
            <p className={styles.reviewDescription}>Не удалось загрузить отзывы профиля.</p>
            <Button
              onClick={() => {
                void reviewsQuery.refetch();
              }}
              size="sm"
              variant="secondary"
            >
              Повторить
            </Button>
          </div>
        ) : orderReview ? (
          <div className={styles.reviewCard}>
            <div className={styles.reviewMeta}>
              <span className={styles.reviewRating}>{orderReview.rating} / 5</span>
              <span className={styles.reviewDate}>
                Опубликован {formatReviewDate(orderReview.createdAt)}
              </span>
            </div>
            <p className={styles.reviewText}>{orderReview.comment}</p>
          </div>
        ) : canReview ? (
          <p className={styles.reviewDescription}>
            Заявка завершена, но отзыв пока не оставлен. Можно добавить его сейчас.
          </p>
        ) : (
          <p className={styles.reviewDescription}>
            Отзыв можно оставить после того, как заявка перейдет в статус завершенной.
          </p>
        )}
      </section>

      <div className={styles.actions}>
        <Button
          onClick={() => {
            navigate("/profile/requests");
          }}
          size="sm"
          variant="secondary"
        >
          Назад к списку заявок
        </Button>
      </div>

      {canReview ? (
        <ReviewFormModal
          error={reviewError}
          fieldErrors={reviewFieldErrors}
          initialValues={{
            rating: orderReview?.rating ?? 5,
            comment: orderReview?.comment ?? "",
          }}
          isDeleting={deleteReviewMutation.isPending}
          isOpen={isReviewModalOpen}
          isSubmitting={isReviewSubmitting}
          mode={orderReview ? "edit" : "create"}
          onClose={() => {
            setIsReviewModalOpen(false);
            resetReviewFeedback();
          }}
          onDelete={() => {
            void handleReviewDelete();
          }}
          onFieldChange={(field) => {
            clearReviewFieldError(field);
          }}
          onSubmit={handleReviewSubmit}
          orderLabel={formatOrderId(order.id)}
          serviceTitle={order.service.title}
        />
      ) : null}
    </article>
  );
};

export default ProfileOrderDetailsPage;
