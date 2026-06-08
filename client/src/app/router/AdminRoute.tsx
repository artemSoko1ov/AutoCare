import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "@app/providers/store/hooks";

const AdminRoute = () => {
  const { isAuth } = useAppSelector((state) => state.session);
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const location = useLocation();

  if (!isAuth) {
    const from = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate replace state={{ from }} to="/login" />;
  }

  if (currentUser?.role !== "ADMIN") {
    return <Navigate replace to="/profile" />;
  }

  return <Outlet />;
};

export default AdminRoute;
