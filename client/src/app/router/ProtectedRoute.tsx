import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "@app/providers/store/hooks";

const ProtectedRoute = () => {
  const { isAuth } = useAppSelector((state) => state.session);
  const location = useLocation();

  if (!isAuth) {
    const from = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate replace state={{ from }} to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
