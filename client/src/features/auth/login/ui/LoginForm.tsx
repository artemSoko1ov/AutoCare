import { useState } from "react";
import { useAppSelector } from "@app/providers/store/hooks";
import { useLogin } from "../model/useLogin";

const LoginForm = () => {
  const { executeLogin, loading, error } = useLogin();
  const session = useAppSelector((state) => state.session);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
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

      <pre style={{ marginTop: "1rem", fontSize: "0.8rem" }}>
        Session state: {JSON.stringify(session, null, 2)}
      </pre>
    </form>
  );
};

export default LoginForm;
