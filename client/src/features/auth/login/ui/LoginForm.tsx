import { type FormEvent, useState } from "react";

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
    <form onSubmit={handleSubmit}>
      <h2>Вход</h2>

      {error && <div>{error}</div>}

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Введите email"
        required
        disabled={loading}
      />

      <label htmlFor="password">Пароль</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Введите пароль"
        required
        disabled={loading}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Загрузка..." : "Войти"}
      </button>
    </form>
  );
};

export default LoginForm;
