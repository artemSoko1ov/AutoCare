import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import Button from "@/shared/ui/Button";
import { LEGAL_DOCS } from "@/shared/config/legalDocs";
import Form from "@/shared/ui/Form";
import Icon from "@/shared/ui/Icon";
import Input from "@/shared/ui/Input";
import {
  formatRussianPhoneInput,
  isRussianPhoneComplete,
  RUSSIAN_PHONE_PLACEHOLDER,
} from "@/shared/lib/forms/phone";
import { useRegister } from "../model/useRegister.ts";
import styles from "./RegisterForm.module.scss";

const RegisterForm = () => {
  const { executeRegister, loading, error } = useRegister();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isConsentChecked, setIsConsentChecked] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [consentError, setConsentError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPhoneError(null);
    setConfirmPasswordError(null);
    setConsentError(null);

    if (!isRussianPhoneComplete(phone)) {
      setPhoneError("Введите телефон полностью");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Пароли не совпадают");
      return;
    }

    if (!isConsentChecked) {
      setConsentError("Подтвердите согласие на обработку персональных данных");
      return;
    }

    await executeRegister({
      email: email.trim(),
      username: username.trim(),
      phone,
      password,
    });
  };

  return (
    <Form
      actions={
        <Button className={styles.submitButton} fullWidth loading={loading} type="submit">
          Зарегистрироваться
        </Button>
      }
      actionsClassName={styles.actions}
      bodyClassName={styles.body}
      error={error}
      footer={
        <div className={styles.footerContent}>
          <div className={styles.footerDivider}>или</div>
          <p className={styles.footerText}>
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </p>
          <div className={styles.securityNote}>
            <Icon name="shield" />
            Мы защищаем ваши данные и не передаем их третьим лицам.
          </div>
        </div>
      }
      footerClassName={styles.footerContainer}
      onSubmit={handleSubmit}
      width="md"
    >
      <Input
        autoComplete="name"
        autoFocus
        disabled={loading}
        id="username"
        label="Имя"
        leftIcon={<Icon name="user" />}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Введите ваше имя"
        required
        type="text"
        value={username}
      />

      <Input
        autoComplete="email"
        disabled={loading}
        id="email"
        label="Email"
        leftIcon={<Icon name="mail" />}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Введите email"
        required
        type="email"
        value={email}
      />

      <Input
        autoComplete="tel"
        disabled={loading}
        error={phoneError}
        id="phone"
        inputMode="tel"
        label="Телефон"
        leftIcon={<Icon name="phone" />}
        maxLength={18}
        onChange={(e) => {
          setPhone(formatRussianPhoneInput(e.target.value));
          setPhoneError(null);
        }}
        placeholder={RUSSIAN_PHONE_PLACEHOLDER}
        required
        type="tel"
        value={phone}
      />

      <Input
        autoComplete="new-password"
        disabled={loading}
        id="password"
        label="Пароль"
        leftIcon={<Icon name="lock" />}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Введите пароль"
        rightAction={
          <button
            aria-label={isPasswordVisible ? "Скрыть пароль" : "Показать пароль"}
            className={styles.passwordToggle}
            onClick={() => setIsPasswordVisible((currentValue) => !currentValue)}
            type="button"
          >
            <span className={styles.passwordToggleLabel}>
              {isPasswordVisible ? "Скрыть пароль" : "Показать пароль"}
            </span>
            <Icon name={isPasswordVisible ? "eye-slash" : "eye"} />
          </button>
        }
        required
        type={isPasswordVisible ? "text" : "password"}
        value={password}
      />

      <Input
        autoComplete="new-password"
        disabled={loading}
        error={confirmPasswordError}
        id="confirmPassword"
        label="Повторите пароль"
        leftIcon={<Icon name="lock" />}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          setConfirmPasswordError(null);
        }}
        placeholder="Введите пароль еще раз"
        rightAction={
          <button
            aria-label={isConfirmPasswordVisible ? "Скрыть пароль" : "Показать пароль"}
            className={styles.passwordToggle}
            onClick={() => setIsConfirmPasswordVisible((currentValue) => !currentValue)}
            type="button"
          >
            <span className={styles.passwordToggleLabel}>
              {isConfirmPasswordVisible ? "Скрыть пароль" : "Показать пароль"}
            </span>
            <Icon name={isConfirmPasswordVisible ? "eye-slash" : "eye"} />
          </button>
        }
        required
        type={isConfirmPasswordVisible ? "text" : "password"}
        value={confirmPassword}
      />

      <div className={styles.checkboxField}>
        <label className={styles.checkboxLabel} htmlFor="register-consent">
          <input
            checked={isConsentChecked}
            id="register-consent"
            onChange={(e) => {
              setIsConsentChecked(e.target.checked);
              setConsentError(null);
            }}
            type="checkbox"
          />
          <span className={styles.checkboxText}>
            Я подтверждаю{" "}
            <a href={LEGAL_DOCS.consent.href} rel="noreferrer" target="_blank">
              согласие на обработку персональных данных
            </a>
            , ознакомлен с{" "}
            <a href={LEGAL_DOCS.privacyPolicy.href} rel="noreferrer" target="_blank">
              политикой конфиденциальности
            </a>{" "}
            и{" "}
            <a href={LEGAL_DOCS.personalDataPolicy.href} rel="noreferrer" target="_blank">
              политикой обработки персональных данных
            </a>
          </span>
        </label>

        {consentError ? <p className={styles.checkboxError}>{consentError}</p> : null}
      </div>
    </Form>
  );
};

export default RegisterForm;
