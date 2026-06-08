import { useState } from "react";
import clsx from "clsx";
import type { AdminService } from "@/entities/admin/model";
import Button from "@/shared/ui/Button";
import Icon from "@/shared/ui/Icon";
import Input from "@/shared/ui/Input";
import Modal from "@/shared/ui/Modal";
import Select, { type SelectOption } from "@/shared/ui/Select";
import styles from "./AdminServicesTable.module.scss";

type AdminServicesTableProps = {
  services: AdminService[];
};

type ServiceFormState = {
  title: string;
  category: string;
  price: string;
  duration: string;
  tone: AdminService["tone"];
};

type NoticeState = {
  text: string;
  tone: "success" | "info";
};

const statusOptions: SelectOption[] = [
  { label: "Активна", value: "active" },
  { label: "Черновик", value: "draft" },
  { label: "Скрыта", value: "hidden" },
];

const NEW_SERVICE_ID = "__new_service__";

const getStatusLabel = (tone: AdminService["tone"]) => {
  switch (tone) {
    case "active":
      return "Активна";
    case "draft":
      return "Черновик";
    case "hidden":
      return "Скрыта";
    default:
      return "";
  }
};

const AdminServicesTable = ({ services }: AdminServicesTableProps) => {
  const [items, setItems] = useState(services);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [formState, setFormState] = useState<ServiceFormState>({
    title: "",
    category: "",
    price: "",
    duration: "",
    tone: "active",
  });

  const editingItem = items.find((item) => item.id === editingId) ?? null;
  const isCreateMode = editingId === NEW_SERVICE_ID;

  const handleCreateOpen = () => {
    setEditingId(NEW_SERVICE_ID);
    setFormState({
      title: "",
      category: "",
      price: "",
      duration: "",
      tone: "active",
    });
  };

  const handleEditOpen = (service: AdminService) => {
    setEditingId(service.id);
    setFormState({
      title: service.title,
      category: service.category,
      price: service.price,
      duration: service.duration,
      tone: service.tone,
    });
  };

  const handleEditClose = () => {
    setEditingId(null);
  };

  const handleSave = () => {
    if (isCreateMode) {
      const nextNumber = items.length + 301;
      const nextTitle = formState.title;

      setItems((currentItems) => [
        {
          id: `SRV-${nextNumber}`,
          title: nextTitle,
          category: formState.category,
          price: formState.price,
          duration: formState.duration,
          tone: formState.tone,
          status: getStatusLabel(formState.tone),
        },
        ...currentItems,
      ]);
      setNotice({
        text: `Услуга "${nextTitle}" создана локально.`,
        tone: "success",
      });
      handleEditClose();
      return;
    }

    if (!editingItem) {
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              title: formState.title,
              category: formState.category,
              price: formState.price,
              duration: formState.duration,
              tone: formState.tone,
              status: getStatusLabel(formState.tone),
            }
          : item,
      ),
    );
    setNotice({
      text: `Услуга "${formState.title}" обновлена.`,
      tone: "info",
    });
    handleEditClose();
  };

  const handleDelete = (serviceId: string) => {
    const deletedItem = items.find((item) => item.id === serviceId);

    setItems((currentItems) => currentItems.filter((item) => item.id !== serviceId));
    setNotice({
      text: deletedItem
        ? `Услуга "${deletedItem.title}" удалена из локального списка.`
        : "Услуга удалена из локального списка.",
      tone: "info",
    });

    if (editingId === serviceId) {
      handleEditClose();
    }
  };

  return (
    <article className={clsx("surface", "surface--glass", styles.section)}>
      <div className={styles.header}>
        <div className={styles.headerMain}>
          <h2 className={styles.title}>Услуги</h2>
          <p className={styles.description}>
            Простая таблица услуг на моковых данных с локальным редактированием и удалением.
          </p>
        </div>

        <Button
          className={styles.createButton}
          leftIcon={<Icon name="plus" />}
          onClick={handleCreateOpen}
          size="sm"
          variant="primary"
        >
          Создать услугу
        </Button>
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
              <th>Название</th>
              <th>Категория</th>
              <th>Цена</th>
              <th>Длительность</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.map((service) => (
              <tr key={service.id}>
                <td data-label="ID">{service.id}</td>
                <td data-label="Название">{service.title}</td>
                <td data-label="Категория">{service.category}</td>
                <td data-label="Цена">{service.price}</td>
                <td data-label="Длительность">{service.duration}</td>
                <td data-label="Статус">
                  <span className={clsx(styles.status, styles[`status--${service.tone}`])}>
                    {service.status}
                  </span>
                </td>
                <td data-label="Действия">
                  <div className={styles.actions}>
                    <Button
                      className={styles.actionButton}
                      leftIcon={<Icon name="pencil" />}
                      onClick={() => {
                        handleEditOpen(service);
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
                        handleDelete(service.id);
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
              {isCreateMode ? "Создать" : "Сохранить"}
            </Button>
          </>
        }
        description="Изменения сохраняются только локально в моковой таблице."
        isOpen={editingId !== null}
        onClose={handleEditClose}
        title={
          isCreateMode
            ? "Создание услуги"
            : editingItem
              ? `Редактирование ${editingItem.id}`
              : "Редактирование услуги"
        }
      >
        <div className={styles.modalGrid}>
          <Input
            label="Название"
            onChange={(event) => {
              setFormState((currentState) => ({
                ...currentState,
                title: event.target.value,
              }));
            }}
            value={formState.title}
          />
          <Input
            label="Категория"
            onChange={(event) => {
              setFormState((currentState) => ({
                ...currentState,
                category: event.target.value,
              }));
            }}
            value={formState.category}
          />
          <Input
            label="Цена"
            onChange={(event) => {
              setFormState((currentState) => ({
                ...currentState,
                price: event.target.value,
              }));
            }}
            value={formState.price}
          />
          <Input
            label="Длительность"
            onChange={(event) => {
              setFormState((currentState) => ({
                ...currentState,
                duration: event.target.value,
              }));
            }}
            value={formState.duration}
          />
          <Select
            label="Статус"
            onChange={(event) => {
              setFormState((currentState) => ({
                ...currentState,
                tone: event.target.value as AdminService["tone"],
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

export default AdminServicesTable;
