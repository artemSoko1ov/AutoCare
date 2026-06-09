import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import Button from "@/shared/ui/Button";
import Form from "@/shared/ui/Form";
import Icon from "@/shared/ui/Icon";
import Input from "@/shared/ui/Input";
import { useLogin } from "../model/useLogin";
import styles from "./LoginForm.module.scss";

const LoginForm = () => {
  const { executeLogin, loading, error } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await executeLogin({ email, password });
  };

  return (
    <Form
      actions={
        <Button
          className={styles.submitButton}
          fullWidth
          loading={loading}
          rightIcon={<Icon name="chevron-right" />}
          type="submit"
        >
          Войти
        </Button>
      }
      actionsClassName={styles.actions}
      bodyClassName={styles.body}
      error={error}
      footer={
        <div className={styles.footerContent}>
          <div className={styles.footerDivider}>или</div>
          <p className={styles.footerText}>
            Нет аккаунта? <Link to="/sign-up">Зарегистрироваться</Link>
          </p>
        </div>
      }
      footerClassName={styles.footerContainer}
      onSubmit={handleSubmit}
      width="md"
    >
      <Input
        autoComplete="email"
        autoFocus
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
        autoComplete="current-password"
        disabled={loading}
        id="password"
        label="Пароль"
        leftIcon={<Icon name="lock" />}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Введите пароль"
        rightAction={
          <button
            aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
            className={styles.passwordToggle}
            onClick={() => setShowPassword((currentValue) => !currentValue)}
            type="button"
          >
            <span className={styles.passwordToggleLabel}>
              {showPassword ? "Скрыть пароль" : "Показать пароль"}
            </span>
            <Icon name={showPassword ? "eye-slash" : "eye"} />
          </button>
        }
        required
        type={showPassword ? "text" : "password"}
        value={password}
      />

      <div className={styles.assist}>
        <span className={styles.assistItem}>
          <Icon className={styles.assistItemAccent} name="shield" />
          Защищенный вход
        </span>
        <span className={styles.assistItem}>
          <Icon className={styles.assistItemAccent} name="clock" />
          Быстрый доступ к заявкам
        </span>
      </div>
    </Form>
  );
};

export default LoginForm;
