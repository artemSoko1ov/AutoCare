import { useState } from "react";
import clsx from "clsx";
import type { AdminReview } from "@/entities/admin/model";
import Button from "@/shared/ui/Button";
import Icon from "@/shared/ui/Icon";
import Input from "@/shared/ui/Input";
import Modal from "@/shared/ui/Modal";
import styles from "./AdminReviewsTable.module.scss";

type AdminReviewsTableProps = {
  reviews: AdminReview[];
};

type ReviewFormState = {
  author: string;
  service: string;
  rating: string;
  comment: string;
  createdAt: string;
};

type NoticeState = {
  text: string;
  tone: "success" | "info";
};

const AdminReviewsTable = ({ reviews }: AdminReviewsTableProps) => {
  const [items, setItems] = useState(reviews);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [formState, setFormState] = useState<ReviewFormState>({
    author: "",
    service: "",
    rating: "",
    comment: "",
    createdAt: "",
  });

  const editingItem = items.find((item) => item.id === editingId) ?? null;

  const handleEditOpen = (review: AdminReview) => {
    setEditingId(review.id);
    setFormState({
      author: review.author,
      service: review.service,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
    });
  };

  const handleEditClose = () => {
    setEditingId(null);
  };

  const handleSave = () => {
    if (!editingItem) {
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              author: formState.author,
              service: formState.service,
              rating: formState.rating,
              comment: formState.comment,
              createdAt: formState.createdAt,
            }
          : item,
      ),
    );
    setNotice({
      text: `Отзыв "${editingItem.id}" обновлён.`,
      tone: "info",
    });
    handleEditClose();
  };

  const handleDelete = (reviewId: string) => {
    const deletedItem = items.find((item) => item.id === reviewId);

    setItems((currentItems) => currentItems.filter((item) => item.id !== reviewId));
    setNotice({
      text: deletedItem
        ? `Отзыв "${deletedItem.id}" удалён из локального списка.`
        : "Отзыв удалён из локального списка.",
      tone: "success",
    });

    if (editingId === reviewId) {
      handleEditClose();
    }
  };

  return (
    <article className={clsx("surface", "surface--glass", styles.section)}>
      <div className={styles.header}>
        <h2 className={styles.title}>Отзывы</h2>
        <p className={styles.description}>
          Простая таблица отзывов на моковых данных с локальным редактированием и удалением.
        </p>
      </div>

      {notice && (
        <div
          aria-live="polite"
          className={clsx(styles.notice, styles[`notice--${notice.tone}`])}
          role="status"
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
      )}

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
            {items.map((review) => (
              <tr key={review.id}>
                <td data-label="Автор">{review.author}</td>
                <td data-label="Услуга">{review.service}</td>
                <td data-label="Оценка">{review.rating}</td>
                <td data-label="Отзыв">{review.comment}</td>
                <td data-label="Дата">{review.createdAt}</td>
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
                      onClick={() => {
                        handleDelete(review.id);
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

      <Modal
        actions={
          <>
            <Button onClick={handleEditClose} size="sm" variant="ghost">
              Отмена
            </Button>
            <Button onClick={handleSave} size="sm" variant="primary">
              Сохранить
            </Button>
          </>
        }
        description="Изменения применяются только к локальной моковой таблице."
        isOpen={Boolean(editingItem)}
        onClose={handleEditClose}
        title={editingItem ? `Редактирование ${editingItem.id}` : "Редактирование отзыва"}
      >
        <div className={styles.modalGrid}>
          <Input
            label="Автор"
            onChange={(event) => {
              setFormState((currentState) => ({
                ...currentState,
                author: event.target.value,
              }));
            }}
            value={formState.author}
          />
          <Input
            label="Услуга"
            onChange={(event) => {
              setFormState((currentState) => ({
                ...currentState,
                service: event.target.value,
              }));
            }}
            value={formState.service}
          />
          <Input
            label="Оценка"
            onChange={(event) => {
              setFormState((currentState) => ({
                ...currentState,
                rating: event.target.value,
              }));
            }}
            value={formState.rating}
          />
          <label className={styles.textareaField}>
            <span className={styles.textareaLabel}>Отзыв</span>
            <textarea
              className={styles.textarea}
              onChange={(event) => {
                setFormState((currentState) => ({
                  ...currentState,
                  comment: event.target.value,
                }));
              }}
              rows={5}
              value={formState.comment}
            />
          </label>
          <Input
            label="Дата"
            onChange={(event) => {
              setFormState((currentState) => ({
                ...currentState,
                createdAt: event.target.value,
              }));
            }}
            value={formState.createdAt}
          />
        </div>
      </Modal>
    </article>
  );
};

export default AdminReviewsTable;
