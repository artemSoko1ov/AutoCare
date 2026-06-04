import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "@app/providers/store/hooks";

const GuestOnlyRoute = () => {
  const { isAuth } = useAppSelector((state) => state.session);
  const location = useLocation();

  if (isAuth) {
    const state =
      typeof location.state === "object" && location.state !== null ? location.state : null;
    const redirectTo =
      state && "from" in state && typeof state.from === "string" ? state.from : "/profile";

    return <Navigate replace to={redirectTo} />;
  }

  return <Outlet />;
};

export default GuestOnlyRoute;
