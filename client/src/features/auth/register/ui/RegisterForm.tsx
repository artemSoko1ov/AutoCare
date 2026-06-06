import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import Button from "@/shared/ui/Button";
import Form from "@/shared/ui/Form";
import Input from "@/shared/ui/Input";
import { useRegister } from "../model/useRegister.ts";

const RegisterForm = () => {
  const { executeRegister, loading, error } = useRegister();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await executeRegister({ email, username, password });
  };

  return (
    <Form
      actions={
        <Button fullWidth loading={loading} type="submit">
          Зарегистрироваться
        </Button>
      }
      error={error}
      footer={
        <>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
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
        autoComplete="username"
        disabled={loading}
        id="username"
        label="Имя"
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Введите имя"
        required
        type="text"
        value={username}
      />

      <Input
        autoComplete="new-password"
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

export default RegisterForm;
