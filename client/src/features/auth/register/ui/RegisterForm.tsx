import { type FormEvent, useState } from "react";
import { useAppSelector } from "@app/providers/store/hooks";
import { useRegister } from "../model/useRegister.ts";

const RegisterForm = () => {
  const { executeRegister, loading, error } = useRegister();
  const session = useAppSelector((state) => state.session);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await executeRegister({ email, username, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Регистрация</h2>

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

      <label htmlFor="username">Имя</label>
      <input
        id="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Введите имя"
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

      <pre style={{ marginTop: "1rem", fontSize: "0.8rem" }}>
        Session state: {JSON.stringify(session, null, 2)}
      </pre>
    </form>
  );
};

export default RegisterForm;
