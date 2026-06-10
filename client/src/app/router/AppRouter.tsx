import { Suspense, lazy, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminPage from "@/pages/admin/ui/AdminPage";
import ProfilePage from "@/pages/profile/ui/ProfilePage";
import MainLayout from "@/widgets/layout/ui/MainLayout";
import TopLoader from "@/widgets/top-loader";
import AdminRoute from "./AdminRoute";
import GuestOnlyRoute from "./GuestOnlyRoute";
import ProtectedRoute from "./ProtectedRoute";

const AdminDashboardPage = lazy(() => import("@/pages/admin/ui/AdminDashboardPage"));
const AdminRequestsPage = lazy(() => import("@/pages/admin/ui/AdminRequestsPage"));
const AdminReviewsPage = lazy(() => import("@/pages/admin/ui/AdminReviewsPage"));
const AdminServicesPage = lazy(() => import("@/pages/admin/ui/AdminServicesPage"));
const ContactsPage = lazy(() => import("@/pages/contacts/ui/ContactsPage"));
const HomePage = lazy(() => import("@/pages/home/ui/HomePage"));
const LoginPage = lazy(() => import("@/pages/login/ui/LoginPage"));
const NotFoundPage = lazy(() => import("@/pages/not-found/ui/NotFoundPage"));
const ProfileCarsPage = lazy(() => import("@/pages/profile/ui/ProfileCarsPage"));
const ProfileDashboardPage = lazy(() => import("@/pages/profile/ui/ProfileDashboardPage"));
const ProfileOrderDetailsPage = lazy(() => import("@/pages/profile/ui/ProfileOrderDetailsPage"));
const ProfileOrdersPage = lazy(() => import("@/pages/profile/ui/ProfileOrdersPage"));
const ProfileReviewsPage = lazy(() => import("@/pages/profile/ui/ProfileReviewsPage"));
const RequestCreatePage = lazy(() => import("@/pages/request-create/ui/RequestCreatePage"));
const ServiceDetailsPage = lazy(() => import("@/pages/service-details/ui/ServiceDetailsPage"));
const SitemapPage = lazy(() => import("@/pages/sitemap/ui/SitemapPage"));
const ServicesPage = lazy(() => import("@/pages/services/ui/ServicesPage"));
const SignUpPage = lazy(() => import("@/pages/sign-up/ui/SignUpPage"));

const RouteFallback = () => (
  <div
    aria-busy="true"
    className="container"
    style={{
      minHeight: "40vh",
      paddingBlock: "4rem",
    }}
  >
    Загружаем страницу...
  </div>
);

const withRouteFallback = (page: ReactNode) => (
  <Suspense fallback={<RouteFallback />}>{page}</Suspense>
);

const AppRouter = () => {
  return (
    <BrowserRouter>
      <TopLoader />
      <Routes>
        <Route element={<AdminRoute />} path="/admin">
          <Route element={<AdminPage />}>
            <Route element={<Navigate replace to="dashboard" />} index />
            <Route element={withRouteFallback(<AdminDashboardPage />)} path="dashboard" />
            <Route element={withRouteFallback(<AdminRequestsPage />)} path="requests" />
            <Route element={withRouteFallback(<AdminReviewsPage />)} path="reviews" />
            <Route element={withRouteFallback(<AdminServicesPage />)} path="services" />
          </Route>
        </Route>

        <Route element={<MainLayout />} path="/">
          <Route element={withRouteFallback(<HomePage />)} index />
          <Route element={withRouteFallback(<ServicesPage />)} path="services" />
          <Route element={withRouteFallback(<ServiceDetailsPage />)} path="services/:serviceId" />
          <Route element={withRouteFallback(<ContactsPage />)} path="contacts" />
          <Route element={withRouteFallback(<SitemapPage />)} path="sitemap" />
          <Route element={<GuestOnlyRoute />}>
            <Route element={withRouteFallback(<LoginPage />)} path="login" />
            <Route element={withRouteFallback(<SignUpPage />)} path="sign-up" />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={withRouteFallback(<RequestCreatePage />)} path="requests/new" />
            <Route element={<ProfilePage />} path="profile">
              <Route element={withRouteFallback(<ProfileDashboardPage />)} index />
              <Route element={withRouteFallback(<ProfileCarsPage />)} path="cars" />
              <Route element={withRouteFallback(<ProfileOrdersPage />)} path="requests" />
              <Route
                element={withRouteFallback(<ProfileOrderDetailsPage />)}
                path="requests/:orderId"
              />
              <Route element={withRouteFallback(<ProfileReviewsPage />)} path="reviews" />
            </Route>
          </Route>
          <Route element={withRouteFallback(<NotFoundPage />)} path="*" />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
