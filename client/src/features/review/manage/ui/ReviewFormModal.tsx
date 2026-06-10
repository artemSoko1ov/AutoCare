import { type FormEvent, useState } from "react";
import clsx from "clsx";
import Button from "@/shared/ui/Button";
import Icon from "@/shared/ui/Icon";
import Modal from "@/shared/ui/Modal";
import type { ReviewFieldErrors } from "../model/useReviewMutations";
import styles from "./ReviewFormModal.module.scss";

type ReviewFormMode = "create" | "edit";

type ReviewFormValues = {
  rating: number;
  comment: string;
};

type ReviewFormModalProps = {
  commentLimit?: number;
  error?: string | null;
  fieldErrors?: ReviewFieldErrors;
  isDeleting?: boolean;
  isOpen: boolean;
  isSubmitting?: boolean;
  mode: ReviewFormMode;
  onClose: () => void;
  onDelete?: () => void;
  onFieldChange?: (field: keyof ReviewFormValues) => void;
  onSubmit: (values: ReviewFormValues) => Promise<void> | void;
  orderLabel: string;
  serviceTitle: string;
  initialValues?: Partial<ReviewFormValues>;
};

const defaultCommentLimit = 1000;
const ratingValues = [1, 2, 3, 4, 5] as const;

const getInitialRating = (initialValues?: Partial<ReviewFormValues>) => initialValues?.rating ?? 5;
const getInitialComment = (initialValues?: Partial<ReviewFormValues>) =>
  initialValues?.comment ?? "";

type ReviewFormContentProps = {
  commentLimit: number;
  error: string | null;
  fieldErrors: ReviewFieldErrors;
  initialValues?: Partial<ReviewFormValues>;
  isDeleting: boolean;
  isSubmitting: boolean;
  mode: ReviewFormMode;
  onClose: () => void;
  onDelete?: () => void;
  onFieldChange?: (field: keyof ReviewFormValues) => void;
  onSubmit: (values: ReviewFormValues) => Promise<void> | void;
  orderLabel: string;
  serviceTitle: string;
};

const ReviewFormContent = ({
  commentLimit,
  error,
  fieldErrors,
  initialValues,
  isDeleting,
  isSubmitting,
  mode,
  onClose,
  onDelete,
  onFieldChange,
  onSubmit,
  orderLabel,
  serviceTitle,
}: ReviewFormContentProps) => {
  const [rating, setRating] = useState(getInitialRating(initialValues));
  const [comment, setComment] = useState(getInitialComment(initialValues));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({
      rating,
      comment,
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.context}>
        <div className={styles.contextItem}>
          <span className={styles.contextLabel}>Услуга</span>
          <strong className={styles.contextValue}>{serviceTitle}</strong>
        </div>
        <div className={styles.contextItem}>
          <span className={styles.contextLabel}>Заявка</span>
          <strong className={styles.contextValue}>{orderLabel}</strong>
        </div>
      </div>

      {error ? (
        <div aria-live="polite" className={styles.notice} role="alert">
          {error}
        </div>
      ) : null}

      <div className={styles.field}>
        <span className={styles.label}>Оценка</span>
        <div className={styles.ratingRow}>
          {ratingValues.map((value) => (
            <button
              className={clsx(styles.ratingButton, {
                [styles["ratingButton--active"]]: value <= rating,
              })}
              key={value}
              onClick={() => {
                setRating(value);
                onFieldChange?.("rating");
              }}
              type="button"
            >
              <span className={styles.ratingIcon}>
                <Icon name="star" />
              </span>
              <span className={styles.ratingText}>{value}</span>
            </button>
          ))}
        </div>
        {fieldErrors.rating ? <p className={styles.errorText}>{fieldErrors.rating}</p> : null}
      </div>

      <label
        className={clsx(styles.textareaField, {
          [styles["textareaField--invalid"]]: Boolean(fieldErrors.comment),
        })}
      >
        <span className={styles.label}>Комментарий</span>
        <textarea
          className={styles.textarea}
          maxLength={commentLimit}
          onChange={(event) => {
            setComment(event.target.value);
            onFieldChange?.("comment");
          }}
          placeholder="Расскажите, что понравилось, насколько понятным был процесс и что можно отметить по качеству работы."
          rows={6}
          value={comment}
        />
        <div className={styles.textareaMeta}>
          <span
            className={clsx(styles.helperText, {
              [styles["helperText--error"]]: Boolean(fieldErrors.comment),
            })}
          >
            {fieldErrors.comment ??
              "Отзыв помогает другим клиентам и делает страницу услуги живой."}
          </span>
          <span className={styles.counter}>
            {comment.length} / {commentLimit}
          </span>
        </div>
      </label>

      <div className={styles.actions}>
        {mode === "edit" && onDelete ? (
          <Button loading={isDeleting} onClick={onDelete} size="sm" type="button" variant="ghost">
            Удалить отзыв
          </Button>
        ) : (
          <span className={styles.actionsSpacer} />
        )}

        <div className={styles.actionsGroup}>
          <Button
            disabled={isSubmitting || isDeleting}
            onClick={onClose}
            size="sm"
            type="button"
            variant="secondary"
          >
            Отмена
          </Button>
          <Button loading={isSubmitting} size="sm" type="submit">
            {mode === "create" ? "Опубликовать отзыв" : "Сохранить изменения"}
          </Button>
        </div>
      </div>
    </form>
  );
};

const ReviewFormModal = ({
  commentLimit = defaultCommentLimit,
  error = null,
  fieldErrors = {},
  initialValues,
  isDeleting = false,
  isOpen,
  isSubmitting = false,
  mode,
  onClose,
  onDelete,
  onFieldChange,
  onSubmit,
  orderLabel,
  serviceTitle,
}: ReviewFormModalProps) => {
  const formKey = `${mode}:${orderLabel}:${initialValues?.rating ?? "default"}:${initialValues?.comment ?? ""}`;

  return (
    <Modal
      description={
        mode === "create"
          ? "Оставьте честный отзыв по завершенной заявке. Он появится в профиле, админке и в карточке услуги."
          : "Обновите оценку или комментарий. Изменения сразу синхронизируются со всеми разделами."
      }
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Оставить отзыв" : "Редактировать отзыв"}
    >
      {isOpen ? (
        <ReviewFormContent
          commentLimit={commentLimit}
          error={error}
          fieldErrors={fieldErrors}
          initialValues={initialValues}
          isDeleting={isDeleting}
          isSubmitting={isSubmitting}
          key={formKey}
          mode={mode}
          onClose={onClose}
          onDelete={onDelete}
          onFieldChange={onFieldChange}
          onSubmit={onSubmit}
          orderLabel={orderLabel}
          serviceTitle={serviceTitle}
        />
      ) : null}
    </Modal>
  );
};

export default ReviewFormModal;
