import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import Button from "@/shared/ui/Button";
import Form from "@/shared/ui/Form";
import Input from "@/shared/ui/Input";
import { useLogin } from "../model/useLogin";

const LoginForm = () => {
  const { executeLogin, loading, error } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await executeLogin({ email, password });
  };

  return (
    <Form
      actions={
        <Button fullWidth loading={loading} type="submit">
          Войти
        </Button>
      }
      error={error}
      footer={
        <>
          Нет аккаунта? <Link to="/sign-up">Зарегистрироваться</Link>
        </>
      }
      onSubmit={handleSubmit}
      width="sm"
    >
      <Input
        autoComplete="email"
        disabled={loading}
        id="email"
        label="Email"
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
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Введите пароль"
        required
        type="password"
        value={password}
      />
    </Form>
  );
};

export default LoginForm;
