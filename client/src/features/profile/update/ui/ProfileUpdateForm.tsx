import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from "react";
import type { UpdateProfileBody } from "@shared/contracts/auth";
import { getImageFileValidationError, readFileAsDataUrl } from "@/shared/lib/files/imageUpload";
import Button from "@/shared/ui/Button";
import Icon from "@/shared/ui/Icon";
import Input from "@/shared/ui/Input";
import { useUpdateProfile } from "../model/useUpdateProfile";
import styles from "./ProfileUpdateForm.module.scss";

export type ProfileEditableField = "username" | "phone" | "avatarUrl";
export type ProfileUpdateFormLayout = "inline" | "modal";

type ProfileUpdateFormProps = {
  username: string;
  phone: string;
  avatarUrl: string | null;
  autoFocusField?: ProfileEditableField;
  onAutoFocusHandled?: () => void;
  onCancel: () => void;
  showHeader?: boolean;
  layout?: ProfileUpdateFormLayout;
};

type ProfileUpdateFormState = {
  username: string;
  phone: string;
  avatarUrl: string;
};

const createFormState = ({
  avatarUrl,
  phone,
  username,
}: Pick<ProfileUpdateFormProps, "avatarUrl" | "phone" | "username">): ProfileUpdateFormState => ({
  username,
  phone,
  avatarUrl: avatarUrl ?? "",
});

const normalizeOptionalValue = (value: string) => {
  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
};

const ProfileUpdateForm = ({
  autoFocusField,
  avatarUrl,
  layout = "inline",
  onAutoFocusHandled,
  onCancel,
  phone,
  showHeader = true,
  username,
}: ProfileUpdateFormProps) => {
  const avatarActionRef = useRef<HTMLButtonElement>(null);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);

  const [formState, setFormState] = useState<ProfileUpdateFormState>(() =>
    createFormState({ avatarUrl, phone, username }),
  );
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const {
    clearFieldError,
    clearMessages,
    error,
    executeUpdateProfile,
    fieldErrors,
    loading,
    successMessage,
  } = useUpdateProfile();

  useEffect(() => {
    if (!autoFocusField) {
      return;
    }

    const inputMap: Record<ProfileEditableField, HTMLElement | null> = {
      username: usernameInputRef.current,
      phone: phoneInputRef.current,
      avatarUrl: avatarActionRef.current,
    };

    inputMap[autoFocusField]?.focus();
    onAutoFocusHandled?.();
  }, [autoFocusField, onAutoFocusHandled]);

  const handleChange =
    (field: keyof Pick<ProfileUpdateFormState, "username" | "phone">) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      clearFieldError(field);
      clearMessages();
      setAvatarError(null);

      setFormState((currentState) => ({
        ...currentState,
        [field]: value,
      }));
    };

  const handleAvatarPick = () => {
    clearFieldError("avatarUrl");
    clearMessages();
    setAvatarError(null);
    avatarFileInputRef.current?.click();
  };

  const handleAvatarFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    const imageValidationError = getImageFileValidationError(file);

    if (imageValidationError === "invalid-type") {
      setAvatarError("Выберите файл изображения");
      return;
    }

    if (imageValidationError === "too-large") {
      setAvatarError("Размер фото должен быть не больше 5 МБ");
      return;
    }

    try {
      const nextAvatarUrl = await readFileAsDataUrl(file);
      clearFieldError("avatarUrl");
      clearMessages();
      setAvatarError(null);
      setFormState((currentState) => ({
        ...currentState,
        avatarUrl: nextAvatarUrl,
      }));
    } catch {
      setAvatarError("Не удалось загрузить фото");
    }
  };

  const handleAvatarRemove = () => {
    clearFieldError("avatarUrl");
    clearMessages();
    setAvatarError(null);
    setFormState((currentState) => ({
      ...currentState,
      avatarUrl: "",
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: UpdateProfileBody = {
      username: formState.username.trim(),
      phone: normalizeOptionalValue(formState.phone),
      avatarUrl: normalizeOptionalValue(formState.avatarUrl),
    };

    try {
      await executeUpdateProfile(payload);
    } catch {
      return;
    }
  };

  const handleCancel = () => {
    setFormState(createFormState({ avatarUrl, phone, username }));
    setAvatarError(null);
    onCancel();
  };

  return (
    <form className={styles[`form--${layout}`]} onSubmit={handleSubmit}>
      {showHeader && (
        <div className={styles.header}>
          <div className={styles.headerBody}>
            <h3 className={styles.title}>Редактирование профиля</h3>
            <p className={styles.description}>
              Можно обновить имя, телефон и фотографию профиля. Email пока остается только для
              чтения.
            </p>
          </div>
        </div>
      )}

      {successMessage && (
        <div aria-live="polite" className={styles.notice} role="status">
          {successMessage}
        </div>
      )}

      {error && (
        <div aria-live="polite" className={styles["notice--error"]} role="alert">
          {error}
        </div>
      )}

      <div className={styles.grid}>
        <Input
          autoComplete="name"
          error={fieldErrors.username}
          label="Имя"
          leftIcon={<Icon name="user" />}
          onChange={handleChange("username")}
          placeholder="Введите имя"
          ref={usernameInputRef}
          value={formState.username}
        />

        <Input
          autoComplete="tel"
          error={fieldErrors.phone}
          hint="Можно оставить пустым"
          inputMode="tel"
          label="Телефон"
          leftIcon={<Icon name="phone" />}
          onChange={handleChange("phone")}
          placeholder="+7 (999) 123-45-67"
          ref={phoneInputRef}
          value={formState.phone}
        />

        <div className={styles.fieldWide}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarPreview}>
              {formState.avatarUrl ? (
                <div
                  className={styles.avatarPreviewImage}
                  style={{ backgroundImage: `url(${formState.avatarUrl})` }}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  <Icon name="camera" />
                </div>
              )}
            </div>

            <div className={styles.avatarMeta}>
              <div className={styles.avatarHeading}>
                <span className={styles.avatarTitle}>Фото профиля</span>
                <span className={styles.avatarHint}>
                  Загрузите изображение, и оно сразу появится в шапке профиля.
                </span>
              </div>

              <div className={styles.avatarActions}>
                <Button
                  leftIcon={<Icon name="camera" />}
                  onClick={handleAvatarPick}
                  ref={avatarActionRef}
                  size="sm"
                  type="button"
                  variant="secondary"
                >
                  {formState.avatarUrl ? "Заменить фото" : "Загрузить фото"}
                </Button>

                {formState.avatarUrl ? (
                  <Button onClick={handleAvatarRemove} size="sm" type="button" variant="ghost">
                    Удалить фото
                  </Button>
                ) : null}
              </div>

              {avatarError || fieldErrors.avatarUrl ? (
                <p className={styles.avatarError}>{avatarError ?? fieldErrors.avatarUrl}</p>
              ) : null}
            </div>
          </div>

          <input
            accept="image/*"
            className={styles.fileInput}
            onChange={handleAvatarFileChange}
            ref={avatarFileInputRef}
            type="file"
          />
        </div>
      </div>

      <div className={styles.actions}>
        <Button loading={loading} size="md" type="submit">
          Сохранить изменения
        </Button>

        <Button
          disabled={loading}
          onClick={handleCancel}
          size="md"
          type="button"
          variant="secondary"
        >
          Отмена
        </Button>
      </div>
    </form>
  );
};

export default ProfileUpdateForm;
