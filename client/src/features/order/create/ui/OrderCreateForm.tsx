import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { CarDto } from "@shared/contracts/cars";
import type { CreateOrderBody, CreateOrderResponse } from "@shared/contracts/orders";
import type { GetServiceResponse } from "@shared/contracts/services";
import clsx from "clsx";
import { formatOrderDateTime, formatOrderId, toIsoFromDateTimeLocal } from "@/entities/order";
import { formatServicePrice } from "@/entities/service";
import Button from "@/shared/ui/Button";
import Icon from "@/shared/ui/Icon";
import Select from "@/shared/ui/Select";
import {
  type CreateOrderFieldErrors,
  getCreateOrderErrorMessage,
  getCreateOrderFieldErrors,
  useCreateOrderMutation,
} from "../model/useCreateOrder";
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
const notesLimit = 1000;

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

  const resetForm = () => {
    setFormState({
      carId: cars[0]?.id ?? "",
      scheduledFor: "",
      notes: "",
    });
    setFieldErrors({});
    setErrorMessage(null);
  };

  const clearFieldError = (field: keyof CreateOrderFieldErrors) => {
    setFieldErrors((currentState) => ({
      ...currentState,
      [field]: undefined,
    }));
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
              Мы сохранили обращение и передали его менеджеру. Дальше свяжемся с вами, чтобы
              подтвердить детали, автомобиль и удобное время посещения.
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
            <span className={styles.successLabel}>Время посещения</span>
            <strong className={styles.successValue}>
              {createdOrder.scheduledFor
                ? formatOrderDateTime(createdOrder.scheduledFor)
                : "Согласуем по телефону"}
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
              navigate("/profile/orders");
            }}
            size="md"
          >
            Перейти к моим заявкам
          </Button>
        </div>
      </article>
    );
  }

  return (
    <div className={styles.layout}>
      <form className={clsx("surface", "surface--glass", styles.form)} onSubmit={handleSubmit}>
        {errorMessage ? (
          <div aria-live="polite" className={styles.formError} role="alert">
            {errorMessage}
          </div>
        ) : null}

        <div className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNumber}>1.</span>
            <div className={styles.sectionHeading}>
              <h2 className={styles.sectionTitle}>Автомобиль</h2>
              <p className={styles.sectionDescription}>Выберите автомобиль из гаража</p>
            </div>
          </div>

          <Select
            error={fieldErrors.carId}
            label="Выберите автомобиль из гаража"
            leftIcon={<Icon name="car" />}
            onChange={(event) => {
              setFormState((currentState) => ({
                ...currentState,
                carId: event.target.value,
              }));
              clearFieldError("carId");
            }}
            options={carOptions}
            value={formState.carId}
          />

          <Link className={styles.addCarLink} to="/profile/cars">
            <Icon name="plus" />
            <span>Добавить новый автомобиль</span>
          </Link>
        </div>

        <div className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNumber}>2.</span>
            <div className={styles.sectionHeading}>
              <h2 className={styles.sectionTitle}>Комментарий</h2>
              <p className={styles.sectionDescription}>Комментарий к заявке</p>
            </div>
          </div>

          <label
            className={clsx(styles.textareaField, {
              [styles["textareaField--invalid"]]: Boolean(fieldErrors.notes),
            })}
          >
            <span className={styles.fieldLabel}>Комментарий к заявке</span>
            <textarea
              className={styles.textarea}
              maxLength={notesLimit}
              onChange={(event) => {
                setFormState((currentState) => ({
                  ...currentState,
                  notes: event.target.value,
                }));
                clearFieldError("notes");
              }}
              placeholder="Например: хочу проверить автомобиль до выходных, интересует выездная диагностика и предварительный созвон."
              rows={6}
              value={formState.notes}
            />
          </label>

          <div className={styles.fieldMeta}>
            <span
              className={clsx(styles.helperText, {
                [styles["helperText--error"]]: Boolean(fieldErrors.notes),
              })}
            >
              {fieldErrors.notes ?? "Необязательное поле. Поможет менеджеру быстрее понять задачу."}
            </span>
            <span className={styles.counter}>
              {formState.notes.length} / {notesLimit}
            </span>
          </div>
        </div>

        <div className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNumber}>3.</span>
            <div className={styles.sectionHeading}>
              <h2 className={styles.sectionTitle}>Удобное время</h2>
              <p className={styles.sectionDescription}>Выберите желаемую дату и время</p>
            </div>
          </div>

          <label
            className={clsx(styles.dateField, {
              [styles["dateField--invalid"]]: Boolean(fieldErrors.scheduledFor),
            })}
          >
            <span className={styles.fieldLabel}>Выберите желаемую дату и время</span>

            <div className={styles.dateControl}>
              <span className={styles.dateIcon}>
                <Icon name="clock" />
              </span>
              <input
                className={styles.dateInput}
                onChange={(event) => {
                  setFormState((currentState) => ({
                    ...currentState,
                    scheduledFor: event.target.value,
                  }));
                  clearFieldError("scheduledFor");
                }}
                type="datetime-local"
                value={formState.scheduledFor}
              />
            </div>
          </label>

          {fieldErrors.scheduledFor ? (
            <span className={clsx(styles.helperText, styles["helperText--error"])}>
              {fieldErrors.scheduledFor}
            </span>
          ) : null}

          <div className={styles.notice}>
            <span className={styles.noticeIcon}>
              <Icon name="phone" />
            </span>

            <div className={styles.noticeBody}>
              <strong className={styles.noticeTitle}>Мы свяжемся для подтверждения</strong>
              <p className={styles.noticeText}>
                После отправки заявки наш менеджер свяжется с вами для подтверждения деталей и
                согласования времени.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.formFooter}>
          <Button loading={createOrderMutation.isPending} size="md" type="submit">
            Отправить заявку
          </Button>

          <p className={styles.privacyText}>
            <Icon name="shield" />
            <span>Ваши данные защищены и не передаются третьим лицам</span>
          </p>
        </div>
      </form>

      <aside className={clsx("surface", "surface--glass", styles.summary)}>
        <h2 className={styles.summaryTitle}>Выбранные данные</h2>

        <div className={styles.summaryList}>
          <article className={styles.summaryItem}>
            <span className={styles.summaryIcon}>
              <Icon name="wrench" />
            </span>
            <div className={styles.summaryBody}>
              <span className={styles.summaryLabel}>Услуга</span>
              <strong className={styles.summaryName}>{service.title}</strong>
            </div>
            <span className={styles.summaryAside}>{formatServicePrice(service.priceFrom)}</span>
          </article>

          {selectedCar ? (
            <article className={styles.summaryItem}>
              <span className={styles.summaryIcon}>
                <Icon name="car" />
              </span>
              <div className={styles.summaryBody}>
                <span className={styles.summaryLabel}>Автомобиль</span>
                <strong className={styles.summaryName}>
                  {selectedCar.brand} {selectedCar.model} · {selectedCar.licensePlate}
                </strong>
                <span className={styles.summaryMeta}>
                  {selectedCar.year} год · {mileageFormatter.format(selectedCar.mileage)} км
                </span>
              </div>
            </article>
          ) : null}

          <article className={styles.summaryItem}>
            <span className={styles.summaryIcon}>
              <Icon name="clock" />
            </span>
            <div className={styles.summaryBody}>
              <span className={styles.summaryLabel}>Ориентировочное время выполнения</span>
              <strong className={styles.summaryName}>{service.durationLabel}</strong>
            </div>
          </article>
        </div>
      </aside>
    </div>
  );
};

export default OrderCreateForm;
