import { type FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CarDto } from "@shared/contracts/cars";
import type { CreateOrderBody, CreateOrderResponse } from "@shared/contracts/orders";
import type { GetServiceResponse } from "@shared/contracts/services";
import clsx from "clsx";
import {
  formatOrderDateTime,
  formatOrderId,
  formatOrderMoney,
  toIsoFromDateTimeLocal,
} from "@/entities/order";
import { formatServicePrice } from "@/entities/service";
import {
  type CreateOrderFieldErrors,
  getCreateOrderErrorMessage,
  getCreateOrderFieldErrors,
  useCreateOrderMutation,
} from "../model/useCreateOrder";
import Button from "@/shared/ui/Button";
import Form from "@/shared/ui/Form";
import Icon from "@/shared/ui/Icon";
import Select from "@/shared/ui/Select";
import styles from "./OrderCreateForm.module.scss";

type OrderCreateFormProps = {
  cars: CarDto[];
  service: GetServiceResponse;
};

type OrderCreateFormState = {
  carId: string;
  scheduledFor: string;
  notes: string;
};

const mileageFormatter = new Intl.NumberFormat("ru-RU");

const getCarLabel = (car: CarDto) => `${car.brand} ${car.model} · ${car.licensePlate}`;

const OrderCreateForm = ({ cars, service }: OrderCreateFormProps) => {
  const navigate = useNavigate();
  const createOrderMutation = useCreateOrderMutation();
  const [formState, setFormState] = useState<OrderCreateFormState>({
    carId: cars[0]?.id ?? "",
    scheduledFor: "",
    notes: "",
  });
  const [fieldErrors, setFieldErrors] = useState<CreateOrderFieldErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<CreateOrderResponse | null>(null);

  const carOptions = cars.map((car) => ({
    label: getCarLabel(car),
    value: car.id,
  }));

  const selectedCar = cars.find((car) => car.id === formState.carId) ?? null;

  const schedulePreview = useMemo(() => {
    const isoValue = toIsoFromDateTimeLocal(formState.scheduledFor);
    return isoValue ? formatOrderDateTime(isoValue) : "Согласуем после отправки заявки";
  }, [formState.scheduledFor]);

  const resetForm = () => {
    setFormState({
      carId: cars[0]?.id ?? "",
      scheduledFor: "",
      notes: "",
    });
    setFieldErrors({});
    setErrorMessage(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: CreateOrderBody = {
      serviceId: service.id,
      carId: formState.carId,
      notes: formState.notes.trim() ? formState.notes.trim() : null,
      scheduledFor: toIsoFromDateTimeLocal(formState.scheduledFor),
    };

    setErrorMessage(null);
    setFieldErrors({});

    try {
      const order = await createOrderMutation.mutateAsync(payload);
      setCreatedOrder(order);
    } catch (error) {
      const { fieldErrors: nextFieldErrors } = getCreateOrderFieldErrors(error);
      setFieldErrors(nextFieldErrors);
      setErrorMessage(getCreateOrderErrorMessage(error));
    }
  };

  if (createdOrder) {
    return (
      <article className={clsx("surface", "surface--glass", styles.successCard)}>
        <div className={styles.successHeader}>
          <span className={styles.successIcon}>
            <Icon name="check-circle" />
          </span>

          <div className={styles.successBody}>
            <h2 className={styles.successTitle}>Заявка отправлена</h2>
            <p className={styles.successText}>
              Мы сохранили обращение и передали его в административную очередь. Дальше менеджер
              свяжется с вами, чтобы подтвердить детали и удобное время.
            </p>
          </div>
        </div>

        <div className={styles.successGrid}>
          <div className={styles.successFact}>
            <span className={styles.successLabel}>Номер заявки</span>
            <strong className={styles.successValue}>{formatOrderId(createdOrder.id)}</strong>
          </div>
          <div className={styles.successFact}>
            <span className={styles.successLabel}>Услуга</span>
            <strong className={styles.successValue}>{createdOrder.service.title}</strong>
          </div>
          <div className={styles.successFact}>
            <span className={styles.successLabel}>Автомобиль</span>
            <strong className={styles.successValue}>
              {createdOrder.carSnapshot.brand} {createdOrder.carSnapshot.model} ·{" "}
              {createdOrder.carSnapshot.plateNumber}
            </strong>
          </div>
          <div className={styles.successFact}>
            <span className={styles.successLabel}>Предпочтительное время</span>
            <strong className={styles.successValue}>
              {formatOrderDateTime(createdOrder.scheduledFor)}
            </strong>
          </div>
        </div>

        <div className={styles.successActions}>
          <Button
            onClick={() => {
              setCreatedOrder(null);
              resetForm();
            }}
            size="md"
            variant="secondary"
          >
            Создать еще заявку
          </Button>
          <Button
            onClick={() => {
              navigate("/services");
            }}
            size="md"
          >
            Вернуться к услугам
          </Button>
        </div>
      </article>
    );
  }

  return (
    <Form
      actions={
        <>
          <Button disabled={createOrderMutation.isPending} size="md" type="submit">
            Отправить заявку
          </Button>
          <Button
            disabled={createOrderMutation.isPending}
            size="md"
            type="reset"
            variant="secondary"
          >
            Очистить
          </Button>
        </>
      }
      bodyClassName={styles.body}
      className={styles.form}
      description="Выберите автомобиль из гаража, при желании оставьте комментарий и удобное время. Остальные данные подтянем из вашего профиля."
      error={errorMessage}
      onReset={resetForm}
      onSubmit={handleSubmit}
      surface="glass"
      title="Оформление заявки"
      titleAs="h2"
      titleSize="h2"
      width="lg"
    >
      <div className={styles.grid}>
        <Select
          error={fieldErrors.carId}
          label="Автомобиль"
          onChange={(event) => {
            setFormState((currentState) => ({
              ...currentState,
              carId: event.target.value,
            }));
            setFieldErrors((currentState) => ({
              ...currentState,
              carId: undefined,
            }));
            setErrorMessage(null);
          }}
          options={carOptions}
          value={formState.carId}
        />

        <label
          className={clsx(styles.textareaField, {
            [styles["textareaField--invalid"]]: Boolean(fieldErrors.notes),
          })}
        >
          <span className={styles.textareaLabel}>Комментарий</span>
          <textarea
            className={styles.textarea}
            onChange={(event) => {
              setFormState((currentState) => ({
                ...currentState,
                notes: event.target.value,
              }));
              setFieldErrors((currentState) => ({
                ...currentState,
                notes: undefined,
              }));
              setErrorMessage(null);
            }}
            placeholder="Например: хочу проверить автомобиль до выходных, интересует выездная диагностика и предварительный созвон."
            rows={5}
            value={formState.notes}
          />
          <span className={styles.textareaDescription}>
            {fieldErrors.notes ?? "Необязательное поле. Поможет менеджеру быстрее понять задачу."}
          </span>
        </label>

        <label
          className={clsx(styles.textareaField, {
            [styles["textareaField--invalid"]]: Boolean(fieldErrors.scheduledFor),
          })}
        >
          <span className={styles.textareaLabel}>Удобное время</span>
          <input
            className={styles.dateInput}
            onChange={(event) => {
              setFormState((currentState) => ({
                ...currentState,
                scheduledFor: event.target.value,
              }));
              setFieldErrors((currentState) => ({
                ...currentState,
                scheduledFor: undefined,
              }));
              setErrorMessage(null);
            }}
            type="datetime-local"
            value={formState.scheduledFor}
          />
          <span className={styles.textareaDescription}>
            {fieldErrors.scheduledFor ?? "Можно оставить пустым и согласовать время позже."}
          </span>
        </label>
      </div>

      <div className={styles.previewGrid}>
        <article className={styles.previewCard}>
          <span className={styles.previewLabel}>Услуга</span>
          <h3 className={styles.previewTitle}>{service.title}</h3>
          <p className={styles.previewMeta}>
            {service.category} · {service.durationLabel} · {formatServicePrice(service.priceFrom)}
          </p>
        </article>

        {selectedCar ? (
          <article className={styles.previewCard}>
            <span className={styles.previewLabel}>Автомобиль</span>
            <h3 className={styles.previewTitle}>
              {selectedCar.brand} {selectedCar.model}
            </h3>
            <p className={styles.previewMeta}>
              {selectedCar.licensePlate} · {selectedCar.year} ·{" "}
              {mileageFormatter.format(selectedCar.mileage)} км
            </p>
          </article>
        ) : null}

        <article className={styles.previewCard}>
          <span className={styles.previewLabel}>Когда удобно</span>
          <h3 className={styles.previewTitle}>{schedulePreview}</h3>
          <p className={styles.previewMeta}>
            Стоимость услуги от {formatOrderMoney(service.priceFrom)}
          </p>
        </article>
      </div>
    </Form>
  );
};

export default OrderCreateForm;
