import { type ChangeEvent, useState } from "react";
import type { ReviewDto, UpdateReviewBody } from "@shared/contracts/reviews";
import clsx from "clsx";
import { formatReviewDate } from "@/entities/review";
import {
  getReviewErrorMessage,
  getReviewFieldErrors,
  useAdminDeleteReviewMutation,
  useAdminUpdateReviewMutation,
} from "@/features/review/manage";
import Button from "@/shared/ui/Button";
import Empty from "@/shared/ui/Empty";
import Icon from "@/shared/ui/Icon";
import Modal from "@/shared/ui/Modal";
import Select, { type SelectOption } from "@/shared/ui/Select";
import styles from "./AdminReviewsTable.module.scss";

type AdminReviewsTableProps = {
  reviews: ReviewDto[];
};

type ReviewFormState = {
  rating: string;
  comment: string;
};

type NoticeState = {
  text: string;
  tone: "success" | "info" | "error";
};

const ratingOptions: SelectOption[] = [
  { label: "1 / 5", value: "1" },
  { label: "2 / 5", value: "2" },
  { label: "3 / 5", value: "3" },
  { label: "4 / 5", value: "4" },
  { label: "5 / 5", value: "5" },
];

const createFormState = (review: ReviewDto): ReviewFormState => ({
  rating: String(review.rating),
  comment: review.comment,
});

const AdminReviewsTable = ({ reviews }: AdminReviewsTableProps) => {
  const updateReviewMutation = useAdminUpdateReviewMutation();
  const deleteReviewMutation = useAdminDeleteReviewMutation();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof UpdateReviewBody, string>>>(
    {},
  );
  const [formState, setFormState] = useState<ReviewFormState>({
    rating: "5",
    comment: "",
  });

  const editingItem = reviews.find((review) => review.id === editingId) ?? null;
  const isSaving = updateReviewMutation.isPending;

  const clearFieldError = (field: keyof UpdateReviewBody) => {
    setFieldErrors((currentState) => ({
      ...currentState,
      [field]: undefined,
    }));
  };

  const resetFeedback = () => {
    setNotice(null);
    setFieldErrors({});
  };

  const handleEditOpen = (review: ReviewDto) => {
    resetFeedback();
    setEditingId(review.id);
    setFormState(createFormState(review));
  };

  const handleEditClose = () => {
    setEditingId(null);
    setFieldErrors({});
  };

  const handleRatingChange = (event: ChangeEvent<HTMLSelectElement>) => {
    clearFieldError("rating");
    setNotice(null);
    setFormState((currentState) => ({
      ...currentState,
      rating: event.target.value,
    }));
  };

  const handleCommentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    clearFieldError("comment");
    setNotice(null);
    setFormState((currentState) => ({
      ...currentState,
      comment: event.target.value,
    }));
  };

  const handleSave = async () => {
    if (!editingItem) {
      return;
    }

    const parsedRating = Number.parseInt(formState.rating, 10);

    if (!Number.isInteger(parsedRating)) {
      setFieldErrors((currentState) => ({
        ...currentState,
        rating: "Укажите корректную оценку",
      }));
      return;
    }

    const payload: UpdateReviewBody = {
      rating: parsedRating,
      comment: formState.comment,
    };

    resetFeedback();

    try {
      await updateReviewMutation.mutateAsync({
        reviewId: editingItem.id,
        data: payload,
      });

      setNotice({
        text: `Отзыв "${editingItem.id}" обновлен.`,
        tone: "info",
      });
      handleEditClose();
    } catch (error) {
      const { fieldErrors: nextFieldErrors } = getReviewFieldErrors(error);

      setFieldErrors(nextFieldErrors);
      setNotice({
        text: getReviewErrorMessage(error),
        tone: "error",
      });
    }
  };

  const handleDelete = async (review: ReviewDto) => {
    setDeletingId(review.id);
    setNotice(null);

    try {
      await deleteReviewMutation.mutateAsync(review.id);
      setNotice({
        text: `Отзыв "${review.id}" удален.`,
        tone: "success",
      });

      if (editingId === review.id) {
        handleEditClose();
      }
    } catch (error) {
      setNotice({
        text: getReviewErrorMessage(error),
        tone: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <article className={clsx("surface", "surface--glass", styles.section)}>
      <div className={styles.header}>
        <h2 className={styles.title}>Отзывы</h2>
        <p className={styles.description}>
          Таблица подключена к реальному API: здесь можно просматривать клиентские отзывы,
          редактировать рейтинг и текст, а также удалять некорректные записи.
        </p>
      </div>

      {notice ? (
        <div
          aria-live="polite"
          className={clsx(styles.notice, styles[`notice--${notice.tone}`])}
          role={notice.tone === "error" ? "alert" : "status"}
        >
          <span className={styles.noticeText}>{notice.text}</span>
          <button
            aria-label="Закрыть сообщение"
            className={styles.noticeClose}
            onClick={() => {
              setNotice(null);
            }}
            type="button"
          >
            <span className={styles.noticeCloseIcon}>
              <Icon name="x-mark" />
            </span>
          </button>
        </div>
      ) : null}

      {reviews.length === 0 ? (
        <div className={styles.emptyState}>
          <Empty
            compact
            description="Когда пользователи начнут оставлять отзывы по завершенным заявкам, они появятся здесь."
            icon="star"
            title="Список отзывов пока пуст"
          />
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Автор</th>
                <th>Услуга</th>
                <th>Оценка</th>
                <th>Отзыв</th>
                <th>Дата</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id}>
                  <td data-label="Автор">
                    <div className={styles.cellMeta}>
                      <span className={styles.cellTitle}>{review.author.name}</span>
                      <span className={styles.cellSubline}>
                        {review.order.carSnapshot.brand} {review.order.carSnapshot.model} ·{" "}
                        {review.order.carSnapshot.plateNumber}
                      </span>
                    </div>
                  </td>
                  <td data-label="Услуга">
                    <div className={styles.cellMeta}>
                      <span className={styles.cellTitle}>{review.service.title}</span>
                      <span className={styles.cellSubline}>{review.service.category}</span>
                    </div>
                  </td>
                  <td data-label="Оценка">
                    <span className={styles.ratingValue}>{review.rating} / 5</span>
                  </td>
                  <td data-label="Отзыв">{review.comment}</td>
                  <td data-label="Дата">{formatReviewDate(review.createdAt)}</td>
                  <td data-label="Действия">
                    <div className={styles.actions}>
                      <Button
                        className={styles.actionButton}
                        leftIcon={<Icon name="pencil" />}
                        onClick={() => {
                          handleEditOpen(review);
                        }}
                        size="sm"
                        variant="secondary"
                      >
                        Редактировать
                      </Button>
                      <Button
                        className={clsx(styles.actionButton, styles.deleteButton)}
                        leftIcon={<Icon name="trash" />}
                        loading={deletingId === review.id}
                        onClick={() => {
                          void handleDelete(review);
                        }}
                        size="sm"
                        variant="ghost"
                      >
                        Удалить
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        actions={
          <>
            <Button disabled={isSaving} onClick={handleEditClose} size="sm" variant="ghost">
              Отмена
            </Button>
            <Button
              loading={isSaving}
              onClick={() => void handleSave()}
              size="sm"
              variant="primary"
            >
              Сохранить
            </Button>
          </>
        }
        description="Изменения сохраняются на сервере и сразу становятся доступны в профиле пользователя и на странице услуги."
        isOpen={editingItem !== null}
        onClose={handleEditClose}
        title={editingItem ? `Редактирование ${editingItem.id}` : "Редактирование отзыва"}
      >
        {editingItem ? (
          <div className={styles.modalGrid}>
            <div className={styles.modalSummary}>
              <div className={styles.modalSummaryItem}>
                <span className={styles.summaryLabel}>Автор</span>
                <strong className={styles.summaryValue}>{editingItem.author.name}</strong>
              </div>
              <div className={styles.modalSummaryItem}>
                <span className={styles.summaryLabel}>Услуга</span>
                <strong className={styles.summaryValue}>{editingItem.service.title}</strong>
              </div>
              <div className={styles.modalSummaryItem}>
                <span className={styles.summaryLabel}>Дата</span>
                <strong className={styles.summaryValue}>
                  {formatReviewDate(editingItem.createdAt)}
                </strong>
              </div>
            </div>

            <Select
              error={fieldErrors.rating}
              label="Оценка"
              onChange={handleRatingChange}
              options={ratingOptions}
              value={formState.rating}
            />

            <label
              className={clsx(styles.textareaField, {
                [styles["textareaField--invalid"]]: Boolean(fieldErrors.comment),
              })}
            >
              <span className={styles.textareaLabel}>Отзыв</span>
              <textarea
                className={styles.textarea}
                onChange={handleCommentChange}
                rows={6}
                value={formState.comment}
              />
              <span
                className={clsx(styles.textareaDescription, {
                  [styles["textareaDescription--error"]]: Boolean(fieldErrors.comment),
                })}
              >
                {fieldErrors.comment ??
                  "Комментарий виден пользователям на странице услуги и в профиле."}
              </span>
            </label>
          </div>
        ) : null}
      </Modal>
    </article>
  );
};

export default AdminReviewsTable;
