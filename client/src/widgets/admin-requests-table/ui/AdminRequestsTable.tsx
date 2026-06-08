import { useState } from "react";
import clsx from "clsx";
import type { AdminRequest } from "@/entities/admin/model";
import Button from "@/shared/ui/Button";
import Icon from "@/shared/ui/Icon";
import Input from "@/shared/ui/Input";
import Modal from "@/shared/ui/Modal";
import Select, { type SelectOption } from "@/shared/ui/Select";
import styles from "./AdminRequestsTable.module.scss";

type AdminRequestsTableProps = {
  requests: AdminRequest[];
};

type RequestFormState = {
  client: string;
  service: string;
  manager: string;
  createdAt: string;
  tone: AdminRequest["tone"];
};

type NoticeState = {
  text: string;
  tone: "success" | "info";
};

const statusOptions: SelectOption[] = [
  { label: "Новая", value: "new" },
  { label: "В работе", value: "progress" },
  { label: "Завершена", value: "done" },
];

const getStatusLabel = (tone: AdminRequest["tone"]) => {
  switch (tone) {
    case "new":
      return "Новая";
    case "progress":
      return "В работе";
    case "done":
      return "Завершена";
    default:
      return "";
  }
};

const AdminRequestsTable = ({ requests }: AdminRequestsTableProps) => {
  const [items, setItems] = useState(requests);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [formState, setFormState] = useState<RequestFormState>({
    client: "",
    service: "",
    manager: "",
    createdAt: "",
    tone: "new",
  });

  const editingItem = items.find((item) => item.id === editingId) ?? null;

  const handleEditOpen = (request: AdminRequest) => {
    setEditingId(request.id);
    setFormState({
      client: request.client,
      service: request.service,
      manager: request.manager,
      createdAt: request.createdAt,
      tone: request.tone,
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
              client: formState.client,
              service: formState.service,
              manager: formState.manager,
              createdAt: formState.createdAt,
              tone: formState.tone,
              status: getStatusLabel(formState.tone),
            }
          : item,
      ),
    );
    setNotice({
      text: `Заявка "${editingItem.id}" обновлена.`,
      tone: "info",
    });
    handleEditClose();
  };

  const handleDelete = (requestId: string) => {
    const deletedItem = items.find((item) => item.id === requestId);

    setItems((currentItems) => currentItems.filter((item) => item.id !== requestId));
    setNotice({
      text: deletedItem
        ? `Заявка "${deletedItem.id}" удалена из локального списка.`
        : "Заявка удалена из локального списка.",
      tone: "success",
    });

    if (editingId === requestId) {
      handleEditClose();
    }
  };

  return (
    <article className={clsx("surface", "surface--glass", styles.section)}>
      <div className={styles.header}>
        <h2 className={styles.title}>Заявки</h2>
        <p className={styles.description}>
          Простая таблица заявок на моковых данных с локальным редактированием и удалением.
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
              <th>ID</th>
              <th>Клиент</th>
              <th>Услуга</th>
              <th>Менеджер</th>
              <th>Дата</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.map((request) => (
              <tr key={request.id}>
                <td data-label="ID">{request.id}</td>
                <td data-label="Клиент">{request.client}</td>
                <td data-label="Услуга">{request.service}</td>
                <td data-label="Менеджер">{request.manager}</td>
                <td data-label="Дата">{request.createdAt}</td>
                <td data-label="Статус">
                  <span className={clsx(styles.status, styles[`status--${request.tone}`])}>
                    {request.status}
                  </span>
                </td>
                <td data-label="Действия">
                  <div className={styles.actions}>
                    <Button
                      className={styles.actionButton}
                      leftIcon={<Icon name="pencil" />}
                      onClick={() => {
                        handleEditOpen(request);
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
                        handleDelete(request.id);
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
        description="Изменения сохраняются только локально в моковой таблице."
        isOpen={Boolean(editingItem)}
        onClose={handleEditClose}
        title={editingItem ? `Редактирование ${editingItem.id}` : "Редактирование заявки"}
      >
        <div className={styles.modalGrid}>
          <Input
            label="Клиент"
            onChange={(event) => {
              setFormState((currentState) => ({
                ...currentState,
                client: event.target.value,
              }));
            }}
            value={formState.client}
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
            label="Менеджер"
            onChange={(event) => {
              setFormState((currentState) => ({
                ...currentState,
                manager: event.target.value,
              }));
            }}
            value={formState.manager}
          />
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
          <Select
            label="Статус"
            onChange={(event) => {
              setFormState((currentState) => ({
                ...currentState,
                tone: event.target.value as AdminRequest["tone"],
              }));
            }}
            options={statusOptions}
            value={formState.tone}
          />
        </div>
      </Modal>
    </article>
  );
};

export default AdminRequestsTable;
