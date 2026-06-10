import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "@app/providers/store/hooks";

const GuestOnlyRoute = () => {
  const { isAuth, isInitialized } = useAppSelector((state) => state.session);
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const location = useLocation();

  if (!isInitialized) {
    return null;
  }

  if (isAuth) {
    const state =
      typeof location.state === "object" && location.state !== null ? location.state : null;
    const requestedPath =
      state && "from" in state && typeof state.from === "string" ? state.from : null;
    const isAdmin = currentUser?.role === "ADMIN";

    const redirectTo = isAdmin
      ? "/admin"
      : requestedPath?.startsWith("/admin")
        ? "/profile"
        : (requestedPath ?? "/profile");

    return <Navigate replace to={redirectTo} />;
  }

  return <Outlet />;
};

export default GuestOnlyRoute;
