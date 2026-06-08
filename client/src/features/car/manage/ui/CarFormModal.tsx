import { type ChangeEvent, type FormEvent, useMemo, useRef, useState } from "react";
import type { CarDto, CreateCarBody } from "@shared/contracts/cars";
import { carBrandValues, getCarModelsByBrand } from "@/entities/car/model/carCatalog";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import Modal from "@/shared/ui/Modal";
import Select from "@/shared/ui/Select";
import type { CarFieldErrors } from "../model/useCarMutations";
import styles from "./CarFormModal.module.scss";

type CarFormModalMode = "create" | "edit";

type CarFormModalProps = {
  car?: CarDto | null;
  error?: string | null;
  fieldErrors?: CarFieldErrors;
  isOpen: boolean;
  isSubmitting?: boolean;
  mode: CarFormModalMode;
  onClose: () => void;
  onFieldChange?: (field: keyof CreateCarBody) => void;
  onSubmit: (data: CreateCarBody) => Promise<void> | void;
};

type CarFormState = {
  brand: string;
  model: string;
  year: string;
  licensePlate: string;
  vin: string;
  mileage: string;
  photoUrl: string;
};

const createInitialFormState = (car?: CarDto | null): CarFormState => ({
  brand: car?.brand ?? "",
  model: car?.model ?? "",
  year: car ? String(car.year) : "",
  licensePlate: car?.licensePlate ?? "",
  vin: car?.vin ?? "",
  mileage: car ? String(car.mileage) : "0",
  photoUrl: car?.photoUrl ?? "",
});

const createEmptyErrors = (): CarFieldErrors => ({});

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Не удалось прочитать файл"));
    };

    reader.onerror = () => {
      reject(new Error("Не удалось прочитать файл"));
    };

    reader.readAsDataURL(file);
  });

const CarFormModal = ({
  car = null,
  error = null,
  fieldErrors = {},
  isOpen,
  isSubmitting = false,
  mode,
  onClose,
  onFieldChange,
  onSubmit,
}: CarFormModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formState, setFormState] = useState<CarFormState>(() => createInitialFormState(car));
  const [clientErrors, setClientErrors] = useState<CarFieldErrors>(createEmptyErrors);

  const brandOptions = useMemo(
    () =>
      carBrandValues.map((brand) => ({
        label: brand,
        value: brand,
      })),
    [],
  );

  const modelOptions = useMemo(
    () =>
      getCarModelsByBrand(formState.brand).map((model) => ({
        label: model,
        value: model,
      })),
    [formState.brand],
  );

  const setFieldValue = (field: keyof CarFormState, value: string) => {
    onFieldChange?.(field);

    setFormState((currentState) => ({
      ...currentState,
      [field]: value,
    }));

    setClientErrors((currentErrors) => ({
      ...currentErrors,
      [field]: undefined,
    }));
  };

  const handleInputChange =
    (field: keyof Pick<CarFormState, "year" | "licensePlate" | "vin" | "mileage">) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setFieldValue(field, event.target.value);
    };

  const handleBrandChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextBrand = event.target.value;
    const nextModels = getCarModelsByBrand(nextBrand);

    onFieldChange?.("brand");
    onFieldChange?.("model");

    setFormState((currentState) => ({
      ...currentState,
      brand: nextBrand,
      model: nextModels.includes(currentState.model) ? currentState.model : "",
    }));

    setClientErrors((currentErrors) => ({
      ...currentErrors,
      brand: undefined,
      model: undefined,
    }));
  };

  const handleModelChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFieldValue("model", event.target.value);
  };

  const handlePhotoPick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setClientErrors((currentErrors) => ({
        ...currentErrors,
        photoUrl: "Выберите файл изображения",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setClientErrors((currentErrors) => ({
        ...currentErrors,
        photoUrl: "Размер фото должен быть не больше 5 МБ",
      }));
      return;
    }

    try {
      const photoUrl = await readFileAsDataUrl(file);
      setFieldValue("photoUrl", photoUrl);
    } catch {
      setClientErrors((currentErrors) => ({
        ...currentErrors,
        photoUrl: "Не удалось загрузить фото",
      }));
    }
  };

  const handlePhotoRemove = () => {
    setFieldValue("photoUrl", "");
  };

  const validateForm = () => {
    const nextErrors: CarFieldErrors = {};
    const year = Number(formState.year);
    const mileage = Number(formState.mileage);

    if (!formState.brand.trim()) {
      nextErrors.brand = "Выберите марку автомобиля";
    }

    if (!formState.model.trim()) {
      nextErrors.model = "Выберите модель автомобиля";
    }

    if (!formState.licensePlate.trim()) {
      nextErrors.licensePlate = "Укажите госномер автомобиля";
    }

    if (!formState.year.trim()) {
      nextErrors.year = "Укажите год выпуска";
    } else if (!Number.isInteger(year)) {
      nextErrors.year = "Год выпуска должен быть целым числом";
    }

    if (!formState.mileage.trim()) {
      nextErrors.mileage = "Укажите пробег";
    } else if (!Number.isInteger(mileage) || mileage < 0) {
      nextErrors.mileage = "Пробег должен быть неотрицательным целым числом";
    }

    setClientErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload: CreateCarBody = {
      brand: formState.brand.trim() as CreateCarBody["brand"],
      model: formState.model.trim(),
      year: Number(formState.year),
      licensePlate: formState.licensePlate.trim().toUpperCase(),
      vin: formState.vin.trim() ? formState.vin.trim().toUpperCase() : null,
      mileage: Number(formState.mileage),
      photoUrl: formState.photoUrl.trim() ? formState.photoUrl.trim() : null,
    };

    await onSubmit(payload);
  };

  const mergedFieldErrors: CarFieldErrors = {
    ...clientErrors,
    ...fieldErrors,
  };

  const title = mode === "create" ? "Добавить автомобиль" : "Редактировать автомобиль";
  const description =
    mode === "create"
      ? "Выберите марку и модель автомобиля, заполните основные данные и при желании добавьте фотографию."
      : "Обновите данные автомобиля. Изменения сразу сохранятся в вашем гараже.";
  const submitLabel = mode === "create" ? "Добавить автомобиль" : "Сохранить изменения";

  return (
    <Modal description={description} isOpen={isOpen} onClose={onClose} title={title}>
      <form className={styles.form} onSubmit={handleSubmit}>
        {error ? <div className={styles.noticeError}>{error}</div> : null}

        <div className={styles.grid}>
          <Select
            error={mergedFieldErrors.brand}
            label="Марка"
            onChange={handleBrandChange}
            options={brandOptions}
            placeholder="Выберите марку"
            value={formState.brand}
          />

          <Select
            disabled={!formState.brand}
            error={mergedFieldErrors.model}
            hint={!formState.brand ? "Сначала выберите марку" : undefined}
            label="Модель"
            onChange={handleModelChange}
            options={modelOptions}
            placeholder="Выберите модель"
            value={formState.model}
          />

          <Input
            error={mergedFieldErrors.year}
            inputMode="numeric"
            label="Год выпуска"
            onChange={handleInputChange("year")}
            placeholder="2018"
            type="number"
            value={formState.year}
          />

          <Input
            error={mergedFieldErrors.mileage}
            inputMode="numeric"
            label="Пробег"
            onChange={handleInputChange("mileage")}
            placeholder="65000"
            type="number"
            value={formState.mileage}
          />

          <Input
            className={styles.fieldWide}
            error={mergedFieldErrors.licensePlate}
            hint="Например: A123BC77"
            label="Госномер"
            onChange={handleInputChange("licensePlate")}
            placeholder="A123BC77"
            value={formState.licensePlate}
          />

          <Input
            className={styles.fieldWide}
            error={mergedFieldErrors.vin}
            hint="Необязательное поле"
            label="VIN"
            onChange={handleInputChange("vin")}
            placeholder="XW7BF4FK90S123456"
            value={formState.vin}
          />

          <div className={styles.fieldWide}>
            <div className={styles.photoSection}>
              <div className={styles.photoPreview}>
                {formState.photoUrl ? (
                  <div
                    className={styles.photoPreviewImage}
                    style={{ backgroundImage: `url(${formState.photoUrl})` }}
                  />
                ) : (
                  <div className={styles.photoPlaceholder}>
                    <span>Фото</span>
                    <small>Необязательно</small>
                  </div>
                )}
              </div>

              <div className={styles.photoMeta}>
                <div className={styles.photoHeading}>
                  <span className={styles.photoTitle}>Фото автомобиля</span>
                  <span className={styles.photoHint}>
                    Можно загрузить фотографию, чтобы карточка машины выглядела живее.
                  </span>
                </div>

                <div className={styles.photoActions}>
                  <Button onClick={handlePhotoPick} size="sm" type="button" variant="secondary">
                    {formState.photoUrl ? "Заменить фото" : "Загрузить фото"}
                  </Button>

                  {formState.photoUrl ? (
                    <Button onClick={handlePhotoRemove} size="sm" type="button" variant="ghost">
                      Удалить фото
                    </Button>
                  ) : null}
                </div>

                {mergedFieldErrors.photoUrl ? (
                  <p className={styles.photoError}>{mergedFieldErrors.photoUrl}</p>
                ) : null}
              </div>
            </div>

            <input
              accept="image/*"
              className={styles.fileInput}
              onChange={handlePhotoFileChange}
              ref={fileInputRef}
              type="file"
            />
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            disabled={isSubmitting}
            onClick={onClose}
            size="md"
            type="button"
            variant="secondary"
          >
            Отмена
          </Button>
          <Button loading={isSubmitting} size="md" type="submit">
            {submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CarFormModal;
