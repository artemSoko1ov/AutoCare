import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "@app/providers/store/hooks";

const ProtectedRoute = () => {
  const { isAuth, isInitialized } = useAppSelector((state) => state.session);
  const location = useLocation();

  if (!isInitialized) {
    return null;
  }

  if (!isAuth) {
    const from = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate replace state={{ from }} to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
