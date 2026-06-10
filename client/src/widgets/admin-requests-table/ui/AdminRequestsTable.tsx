import { type ChangeEvent, useState } from "react";
import type { OrderDto, OrderStatus, UpdateOrderBody } from "@shared/contracts/orders";
import clsx from "clsx";
import {
  formatOrderDateTime,
  formatOrderId,
  formatOrderMoney,
  formatOrderStatus,
  getOrderStatusTone,
  toDateTimeLocalValue,
  toIsoFromDateTimeLocal,
} from "@/entities/order";
import {
  getOrderErrorMessage,
  getOrderFieldErrors,
  useDeleteOrderMutation,
  useUpdateOrderMutation,
} from "@/features/order/manage";
import Button from "@/shared/ui/Button";
import Empty from "@/shared/ui/Empty";
import Icon from "@/shared/ui/Icon";
import Input from "@/shared/ui/Input";
import Modal from "@/shared/ui/Modal";
import Select, { type SelectOption } from "@/shared/ui/Select";
import styles from "./AdminRequestsTable.module.scss";

type AdminRequestsTableProps = {
  orders: OrderDto[];
};

type RequestFormState = {
  status: OrderStatus;
  scheduledFor: string;
  quotedPrice: string;
  notes: string;
};

type NoticeState = {
  text: string;
  tone: "success" | "info" | "error";
};

const mileageFormatter = new Intl.NumberFormat("ru-RU");

const statusOptions: SelectOption[] = [
  { label: "Новая", value: "new" },
  { label: "Подтверждена", value: "confirmed" },
  { label: "В работе", value: "in_progress" },
  { label: "Завершена", value: "completed" },
  { label: "Отменена", value: "cancelled" },
];

const createFormState = (order: OrderDto): RequestFormState => ({
  status: order.status,
  scheduledFor: toDateTimeLocalValue(order.scheduledFor),
  quotedPrice: order.quotedPrice === null ? "" : String(order.quotedPrice),
  notes: order.notes ?? "",
});

const getOrderPriceLabel = (order: OrderDto) => {
  if (order.quotedPrice !== null) {
    return formatOrderMoney(order.quotedPrice);
  }

  return `от ${formatOrderMoney(order.service.priceFrom)}`;
};

const AdminRequestsTable = ({ orders }: AdminRequestsTableProps) => {
  const updateOrderMutation = useUpdateOrderMutation();
  const deleteOrderMutation = useDeleteOrderMutation();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof UpdateOrderBody, string>>>(
    {},
  );
  const [formState, setFormState] = useState<RequestFormState>({
    status: "new",
    scheduledFor: "",
    quotedPrice: "",
    notes: "",
  });

  const editingItem = orders.find((order) => order.id === editingId) ?? null;
  const isSaving = updateOrderMutation.isPending;

  const clearFieldError = (field: keyof UpdateOrderBody) => {
    setFieldErrors((currentState) => ({
      ...currentState,
      [field]: undefined,
    }));
  };

  const resetFeedback = () => {
    setNotice(null);
    setFieldErrors({});
  };

  const handleEditOpen = (order: OrderDto) => {
    resetFeedback();
    setEditingId(order.id);
    setFormState(createFormState(order));
  };

  const handleEditClose = () => {
    setEditingId(null);
    setFieldErrors({});
  };

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    clearFieldError("status");
    setNotice(null);
    setFormState((currentState) => ({
      ...currentState,
      status: event.target.value as OrderStatus,
    }));
  };

  const handleInputChange =
    (field: keyof Pick<RequestFormState, "scheduledFor" | "quotedPrice">) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      clearFieldError(field === "scheduledFor" ? "scheduledFor" : "quotedPrice");
      setNotice(null);
      setFormState((currentState) => ({
        ...currentState,
        [field]: event.target.value,
      }));
    };

  const handleNotesChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    clearFieldError("notes");
    setNotice(null);
    setFormState((currentState) => ({
      ...currentState,
      notes: event.target.value,
    }));
  };

  const handleSave = async () => {
    if (!editingItem) {
      return;
    }

    let quotedPrice: number | null = null;

    if (formState.quotedPrice.trim() !== "") {
      const parsedQuotedPrice = Number.parseInt(formState.quotedPrice.trim(), 10);

      if (!Number.isFinite(parsedQuotedPrice)) {
        setFieldErrors((currentState) => ({
          ...currentState,
          quotedPrice: "Укажите стоимость целым числом",
        }));
        return;
      }

      quotedPrice = parsedQuotedPrice;
    }

    const payload: UpdateOrderBody = {
      status: formState.status,
      scheduledFor: toIsoFromDateTimeLocal(formState.scheduledFor),
      quotedPrice,
      notes: formState.notes.trim() ? formState.notes.trim() : null,
    };

    resetFeedback();

    try {
      const updatedOrder = await updateOrderMutation.mutateAsync({
        orderId: editingItem.id,
        data: payload,
      });

      setNotice({
        text: `Заявка "${formatOrderId(updatedOrder.id)}" обновлена.`,
        tone: "info",
      });
      handleEditClose();
    } catch (error) {
      const { fieldErrors: nextFieldErrors } = getOrderFieldErrors(error);

      setFieldErrors(nextFieldErrors);
      setNotice({
        text: getOrderErrorMessage(error),
        tone: "error",
      });
    }
  };

  const handleDelete = async (order: OrderDto) => {
    setDeletingId(order.id);
    setNotice(null);

    try {
      await deleteOrderMutation.mutateAsync(order.id);

      setNotice({
        text: `Заявка "${formatOrderId(order.id)}" удалена.`,
        tone: "success",
      });

      if (editingId === order.id) {
        handleEditClose();
      }
    } catch (error) {
      setNotice({
        text: getOrderErrorMessage(error),
        tone: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <article className={clsx("surface", "surface--glass", styles.section)}>
      <div className={styles.header}>
        <h2 className={styles.title}>Заявки</h2>
        <p className={styles.description}>
          Таблица подключена к реальному API: здесь можно просматривать обращения, обновлять их
          статус и фиксировать стоимость или время визита.
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

      {orders.length === 0 ? (
        <div className={styles.emptyState}>
          <Empty
            compact
            description="Как только пользователи начнут отправлять заявки, они появятся здесь."
            icon="orders"
            title="Список заявок пока пуст"
          />
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Клиент</th>
                <th>Услуга</th>
                <th>Автомобиль</th>
                <th>Создана</th>
                <th>Запланировано</th>
                <th>Стоимость</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td data-label="ID">
                    <span className={styles.idValue} title={order.id}>
                      {formatOrderId(order.id)}
                    </span>
                  </td>
                  <td data-label="Клиент">
                    <div className={styles.cellMeta}>
                      <span className={styles.cellTitle}>{order.customer.name}</span>
                      <span className={styles.cellSubline}>
                        {[order.customer.email, order.customer.phone].filter(Boolean).join(" · ")}
                      </span>
                    </div>
                  </td>
                  <td data-label="Услуга">
                    <div className={styles.cellMeta}>
                      <span className={styles.cellTitle}>{order.service.title}</span>
                      <span className={styles.cellSubline}>
                        {order.service.category} · {order.service.durationLabel}
                      </span>
                    </div>
                  </td>
                  <td data-label="Автомобиль">
                    <div className={styles.cellMeta}>
                      <span className={styles.cellTitle}>
                        {order.carSnapshot.brand} {order.carSnapshot.model}
                      </span>
                      <span className={styles.cellSubline}>
                        {order.carSnapshot.plateNumber} · {order.carSnapshot.year} ·{" "}
                        {mileageFormatter.format(order.carSnapshot.mileage)} км
                      </span>
                    </div>
                  </td>
                  <td data-label="Создана">{formatOrderDateTime(order.createdAt)}</td>
                  <td data-label="Запланировано">{formatOrderDateTime(order.scheduledFor)}</td>
                  <td data-label="Стоимость">{getOrderPriceLabel(order)}</td>
                  <td data-label="Статус">
                    <span
                      className={clsx(
                        styles.status,
                        styles[`status--${getOrderStatusTone(order.status)}`],
                      )}
                    >
                      {formatOrderStatus(order.status)}
                    </span>
                  </td>
                  <td data-label="Действия">
                    <div className={styles.actions}>
                      <Button
                        className={styles.actionButton}
                        leftIcon={<Icon name="pencil" />}
                        onClick={() => {
                          handleEditOpen(order);
                        }}
                        size="sm"
                        variant="secondary"
                      >
                        Редактировать
                      </Button>
                      <Button
                        className={clsx(styles.actionButton, styles.deleteButton)}
                        leftIcon={<Icon name="trash" />}
                        loading={deletingId === order.id}
                        onClick={() => {
                          void handleDelete(order);
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
        description="Изменения сохраняются на сервере и сразу синхронизируются с административным списком."
        isOpen={editingItem !== null}
        onClose={handleEditClose}
        title={
          editingItem ? `Редактирование ${formatOrderId(editingItem.id)}` : "Редактирование заявки"
        }
      >
        <div className={styles.modalGrid}>
          <Select
            error={fieldErrors.status}
            label="Статус"
            onChange={handleStatusChange}
            options={statusOptions}
            value={formState.status}
          />

          <Input
            error={fieldErrors.scheduledFor}
            label="Запланировано"
            onChange={handleInputChange("scheduledFor")}
            type="datetime-local"
            value={formState.scheduledFor}
          />

          <Input
            error={fieldErrors.quotedPrice}
            inputMode="numeric"
            label="Стоимость"
            min="0"
            onChange={handleInputChange("quotedPrice")}
            type="number"
            value={formState.quotedPrice}
          />

          <label
            className={clsx(styles.textareaField, {
              [styles["textareaField--invalid"]]: Boolean(fieldErrors.notes),
            })}
          >
            <span className={styles.textareaLabel}>Комментарий администратора</span>
            <textarea
              className={styles.textarea}
              onChange={handleNotesChange}
              placeholder="Например: согласовали визит на утро, клиент ждет предварительный звонок."
              rows={5}
              value={formState.notes}
            />
            <span className={styles.textareaDescription}>
              {fieldErrors.notes ??
                "Необязательное поле. Здесь можно сохранить детали общения или договоренности по заявке."}
            </span>
          </label>
        </div>
      </Modal>
    </article>
  );
};

export default AdminRequestsTable;
