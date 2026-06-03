import { useLogout } from "../model/useLogout";

const LogoutButton = () => {
  const { executeLogout, loading } = useLogout();

  return (
    <button onClick={executeLogout} disabled={loading}>
      {loading ? "Выход..." : "Выйти"}
    </button>
  );
};

export default LogoutButton;
