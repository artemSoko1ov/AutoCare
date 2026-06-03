import { type FormEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "@app/providers/store/hooks.ts";
import { loginApi } from "@/features/auth/login/api/loginApi.ts";
import { setCredentials } from "@/entities/session/model/sessionSlice.ts";

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.session);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await loginApi({ email, password });
      dispatch(setCredentials({ user: data.user, accessToken: data.accessToken }));
      setEmail("");
      setPassword("");
      setError("");
    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.message || "Ошибка при входе");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Вход</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <label htmlFor="email">Email</label>
      <input
        className=""
        type="email"
        id="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Введите Email"
      />

      <label htmlFor="password">Пароль</label>
      <input
        className=""
        type="password"
        id="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Введите пароль"
      />
      <button className="" type="submit">
        {loading ? "Загрузка..." : "Войти"}
      </button>
      <pre style={{ marginTop: "1rem", fontSize: "0.8rem" }}>
        Session state: {JSON.stringify(session, null, 2)}
      </pre>
    </form>
  );
};

export default LoginForm;
