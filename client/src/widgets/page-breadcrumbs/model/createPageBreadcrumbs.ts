import { matchPath } from "react-router-dom";

export type BreadcrumbItem = {
  label: string;
  to?: string;
};

type CreatePageBreadcrumbsArgs = {
  pathname: string;
  serviceId?: string;
  serviceTitle?: string;
  serviceCategory?: string;
};

const homeItem: BreadcrumbItem = {
  label: "Главная",
  to: "/",
};

const normalizePathname = (pathname: string) => {
  if (pathname === "/") {
    return pathname;
  }

  return pathname.replace(/\/+$/, "");
};

const getServiceCrumbLabel = ({
  serviceCategory,
  serviceTitle,
}: Pick<CreatePageBreadcrumbsArgs, "serviceCategory" | "serviceTitle">) => {
  return serviceCategory || serviceTitle || "Услуга";
};

export const createPageBreadcrumbs = ({
  pathname,
  serviceCategory,
  serviceId,
  serviceTitle,
}: CreatePageBreadcrumbsArgs): BreadcrumbItem[] => {
  const normalizedPathname = normalizePathname(pathname);

  if (normalizedPathname === "/") {
    return [];
  }

  if (matchPath("/services/:serviceId", normalizedPathname)) {
    return [
      homeItem,
      { label: "Услуги", to: "/services" },
      { label: getServiceCrumbLabel({ serviceCategory, serviceTitle }) },
    ];
  }

  if (normalizedPathname === "/services") {
    return [homeItem, { label: "Услуги" }];
  }

  if (normalizedPathname === "/contacts") {
    return [homeItem, { label: "Контакты" }];
  }

  if (normalizedPathname === "/login") {
    return [homeItem, { label: "Вход" }];
  }

  if (normalizedPathname === "/sign-up") {
    return [homeItem, { label: "Регистрация" }];
  }

  if (normalizedPathname === "/profile/cars") {
    return [homeItem, { label: "Профиль", to: "/profile" }, { label: "Мои автомобили" }];
  }

  if (normalizedPathname === "/profile") {
    return [homeItem, { label: "Профиль" }];
  }

  if (normalizedPathname === "/requests/new") {
    if (!serviceId) {
      return [homeItem, { label: "Новая заявка" }];
    }

    return [
      homeItem,
      { label: "Услуги", to: "/services" },
      {
        label: getServiceCrumbLabel({ serviceCategory, serviceTitle }),
        to: `/services/${serviceId}`,
      },
      { label: "Новая заявка" },
    ];
  }

  return [homeItem, { label: "Страница не найдена" }];
};
