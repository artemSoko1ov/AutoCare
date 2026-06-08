import { type ChangeEvent, useState } from "react";
import type { CreateServiceBody, ServiceDto, ServiceStatus } from "@shared/contracts/services";
import clsx from "clsx";
import { formatServiceId, formatServicePrice, formatServiceStatus } from "@/entities/service";
import {
  getServiceErrorMessage,
  getServiceFieldErrors,
  useCreateServiceMutation,
  useDeleteServiceMutation,
  useUpdateServiceMutation,
} from "@/features/service/manage";
import Button from "@/shared/ui/Button";
import Empty from "@/shared/ui/Empty";
import Icon from "@/shared/ui/Icon";
import Input from "@/shared/ui/Input";
import Modal from "@/shared/ui/Modal";
import Select, { type SelectOption } from "@/shared/ui/Select";
import styles from "./AdminServicesTable.module.scss";

type AdminServicesTableProps = {
  services: ServiceDto[];
};

type ServiceFormState = {
  title: string;
  category: string;
  summary: string;
  priceFrom: string;
  durationLabel: string;
  status: ServiceStatus;
};

type NoticeState = {
  text: string;
  tone: "success" | "info" | "error";
};

const statusOptions: SelectOption[] = [
  { label: "Активна", value: "active" },
  { label: "Черновик", value: "draft" },
  { label: "Скрыта", value: "hidden" },
];

const NEW_SERVICE_ID = "__new_service__";

const createEmptyFormState = (): ServiceFormState => ({
  title: "",
  category: "",
  summary: "",
  priceFrom: "",
  durationLabel: "",
  status: "active",
});

const createFormState = (service: ServiceDto): ServiceFormState => ({
  title: service.title,
  category: service.category,
  summary: service.summary,
  priceFrom: String(service.priceFrom),
  durationLabel: service.durationLabel,
  status: service.status,
});

const AdminServicesTable = ({ services }: AdminServicesTableProps) => {
  const createServiceMutation = useCreateServiceMutation();
  const updateServiceMutation = useUpdateServiceMutation();
  const deleteServiceMutation = useDeleteServiceMutation();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CreateServiceBody, string>>>(
    {},
  );
  const [formState, setFormState] = useState<ServiceFormState>(createEmptyFormState);

  const editingItem = services.find((service) => service.id === editingId) ?? null;
  const isCreateMode = editingId === NEW_SERVICE_ID;
  const isSaving = createServiceMutation.isPending || updateServiceMutation.isPending;

  const clearFieldError = (field: keyof CreateServiceBody) => {
    setFieldErrors((currentState) => ({
      ...currentState,
      [field]: undefined,
    }));
  };

  const resetFeedback = () => {
    setNotice(null);
    setFieldErrors({});
  };

  const handleCreateOpen = () => {
    resetFeedback();
    setEditingId(NEW_SERVICE_ID);
    setFormState(createEmptyFormState());
  };

  const handleEditOpen = (service: ServiceDto) => {
    resetFeedback();
    setEditingId(service.id);
    setFormState(createFormState(service));
  };

  const handleEditClose = () => {
    setEditingId(null);
    setFieldErrors({});
  };

  const handleInputChange =
    (field: keyof Pick<ServiceFormState, "title" | "category" | "priceFrom" | "durationLabel">) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      clearFieldError(field === "priceFrom" ? "priceFrom" : field);
      setNotice(null);
      setFormState((currentState) => ({
        ...currentState,
        [field]: event.target.value,
      }));
    };

  const handleSummaryChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    clearFieldError("summary");
    setNotice(null);
    setFormState((currentState) => ({
      ...currentState,
      summary: event.target.value,
    }));
  };

  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    clearFieldError("status");
    setNotice(null);
    setFormState((currentState) => ({
      ...currentState,
      status: event.target.value as ServiceStatus,
    }));
  };

  const handleSave = async () => {
    const normalizedPrice = Number.parseInt(formState.priceFrom.trim(), 10);

    if (!Number.isFinite(normalizedPrice)) {
      setFieldErrors((currentState) => ({
        ...currentState,
        priceFrom: "Укажите цену целым числом",
      }));
      return;
    }

    const payload: CreateServiceBody = {
      title: formState.title.trim(),
      category: formState.category.trim(),
      summary: formState.summary.trim(),
      priceFrom: normalizedPrice,
      durationLabel: formState.durationLabel.trim(),
      status: formState.status,
    };

    resetFeedback();

    try {
      if (isCreateMode) {
        const createdService = await createServiceMutation.mutateAsync(payload);

        setNotice({
          text: `Услуга "${createdService.title}" создана и уже доступна в административном списке.`,
          tone: "success",
        });
        handleEditClose();
        return;
      }

      if (!editingItem) {
        return;
      }

      const updatedService = await updateServiceMutation.mutateAsync({
        serviceId: editingItem.id,
        data: payload,
      });

      setNotice({
        text: `Услуга "${updatedService.title}" обновлена.`,
        tone: "info",
      });
      handleEditClose();
    } catch (error) {
      const { fieldErrors: nextFieldErrors } = getServiceFieldErrors(error);

      setFieldErrors(nextFieldErrors);
      setNotice({
        text: getServiceErrorMessage(error),
        tone: "error",
      });
    }
  };

  const handleDelete = async (service: ServiceDto) => {
    setDeletingId(service.id);
    setNotice(null);

    try {
      await deleteServiceMutation.mutateAsync(service.id);

      setNotice({
        text: `Услуга "${service.title}" удалена.`,
        tone: "info",
      });

      if (editingId === service.id) {
        handleEditClose();
      }
    } catch (error) {
      setNotice({
        text: getServiceErrorMessage(error),
        tone: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <article className={clsx("surface", "surface--glass", styles.section)}>
      <div className={styles.header}>
        <div className={styles.headerMain}>
          <h2 className={styles.title}>Услуги</h2>
          <p className={styles.description}>
            Таблица подключена к реальному API: здесь можно создавать, редактировать и удалять
            услуги, а активные позиции сразу появляются на публичной странице.
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

      {services.length === 0 ? (
        <div className={styles.emptyState}>
          <Empty
            action={
              <Button leftIcon={<Icon name="plus" />} onClick={handleCreateOpen} size="sm">
                Создать первую услугу
              </Button>
            }
            description="В списке пока нет услуг. Создайте первую запись, и она сразу появится в админке."
            icon="wrench"
            title="Услуги ещё не добавлены"
          />
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Категория</th>
                <th>Описание</th>
                <th>Цена</th>
                <th>Длительность</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td data-label="ID">
                    <span className={styles.idValue} title={service.id}>
                      {formatServiceId(service.id)}
                    </span>
                  </td>
                  <td data-label="Название">{service.title}</td>
                  <td data-label="Категория">{service.category}</td>
                  <td className={styles.summaryCell} data-label="Описание" title={service.summary}>
                    {service.summary}
                  </td>
                  <td data-label="Цена">{formatServicePrice(service.priceFrom)}</td>
                  <td data-label="Длительность">{service.durationLabel}</td>
                  <td data-label="Статус">
                    <span className={clsx(styles.status, styles[`status--${service.status}`])}>
                      {formatServiceStatus(service.status)}
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
                        loading={deletingId === service.id}
                        onClick={() => {
                          void handleDelete(service);
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
              {isCreateMode ? "Создать" : "Сохранить"}
            </Button>
          </>
        }
        description="Изменения сохраняются на сервере и сразу синхронизируются с публичным каталогом услуг."
        isOpen={editingId !== null}
        onClose={handleEditClose}
        title={isCreateMode ? "Создание услуги" : "Редактирование услуги"}
      >
        <div className={styles.modalGrid}>
          <Input
            error={fieldErrors.title}
            label="Название"
            onChange={handleInputChange("title")}
            value={formState.title}
          />

          <Input
            error={fieldErrors.category}
            label="Категория"
            onChange={handleInputChange("category")}
            value={formState.category}
          />

          <label
            className={clsx(styles.textareaField, {
              [styles["textareaField--invalid"]]: Boolean(fieldErrors.summary),
            })}
          >
            <span className={styles.textareaLabel}>Описание</span>
            <textarea
              className={styles.textarea}
              onChange={handleSummaryChange}
              rows={5}
              value={formState.summary}
            />
            {fieldErrors.summary ? (
              <span className={styles.textareaDescription}>{fieldErrors.summary}</span>
            ) : null}
          </label>

          <Input
            error={fieldErrors.priceFrom}
            inputMode="numeric"
            label="Цена от"
            min="0"
            onChange={handleInputChange("priceFrom")}
            type="number"
            value={formState.priceFrom}
          />

          <Input
            error={fieldErrors.durationLabel}
            label="Длительность"
            onChange={handleInputChange("durationLabel")}
            value={formState.durationLabel}
          />

          <Select
            error={fieldErrors.status}
            label="Статус"
            onChange={handleStatusChange}
            options={statusOptions}
            value={formState.status}
          />
        </div>
      </Modal>
    </article>
  );
};

export default AdminServicesTable;
