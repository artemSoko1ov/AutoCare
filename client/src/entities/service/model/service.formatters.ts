import type { ServiceStatus } from "@shared/contracts/services";

const rubleFormatter = new Intl.NumberFormat("ru-RU");

export const formatServicePrice = (priceFrom: number) => {
  return `от ${rubleFormatter.format(priceFrom)} ₽`;
};

export const formatServiceStatus = (status: ServiceStatus) => {
  switch (status) {
    case "active":
      return "Активна";
    case "draft":
      return "Черновик";
    case "hidden":
      return "Скрыта";
    default:
      return "";
  }
};

export const formatServiceId = (serviceId: string) => {
  return serviceId.slice(0, 8).toUpperCase();
};
