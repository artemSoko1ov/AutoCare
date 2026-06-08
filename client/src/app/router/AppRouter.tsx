import AdminPage from "@/pages/admin/ui/AdminPage";
import AdminDashboardPage from "@/pages/admin/ui/AdminDashboardPage";
import AdminRequestsPage from "@/pages/admin/ui/AdminRequestsPage";
import AdminReviewsPage from "@/pages/admin/ui/AdminReviewsPage";
import AdminServicesPage from "@/pages/admin/ui/AdminServicesPage";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ContactsPage from "@/pages/contacts/ui/ContactsPage";
import HomePage from "@/pages/home/ui/HomePage";
import LoginPage from "@/pages/login/ui/LoginPage";
import NotFoundPage from "@/pages/not-found/ui/NotFoundPage";
import ProfileCarsPage from "@/pages/profile/ui/ProfileCarsPage";
import ProfileDashboardPage from "@/pages/profile/ui/ProfileDashboardPage";
import ProfilePage from "@/pages/profile/ui/ProfilePage";
import ServicesPage from "@/pages/services/ui/ServicesPage";
import SignUpPage from "@/pages/sign-up/ui/SignUpPage";
import MainLayout from "@/widgets/layout/ui/MainLayout";
import GuestOnlyRoute from "./GuestOnlyRoute";
import ProtectedRoute from "./ProtectedRoute";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />} path="/">
          <Route element={<HomePage />} index />
          <Route element={<AdminPage />} path="admin">
            <Route element={<Navigate replace to="dashboard" />} index />
            <Route element={<AdminDashboardPage />} path="dashboard" />
            <Route element={<AdminRequestsPage />} path="requests" />
            <Route element={<AdminReviewsPage />} path="reviews" />
            <Route element={<AdminServicesPage />} path="services" />
          </Route>
          <Route element={<ServicesPage />} path="services" />
          <Route element={<ContactsPage />} path="contacts" />
          <Route element={<GuestOnlyRoute />}>
            <Route element={<LoginPage />} path="login" />
            <Route element={<SignUpPage />} path="sign-up" />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<ProfilePage />} path="profile">
              <Route element={<ProfileDashboardPage />} index />
              <Route element={<ProfileCarsPage />} path="cars" />
            </Route>
          </Route>
          <Route element={<NotFoundPage />} path="*" />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
