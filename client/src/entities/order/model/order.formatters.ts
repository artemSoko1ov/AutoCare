import type { OrderStatus } from "@shared/contracts/orders";

const rubleFormatter = new Intl.NumberFormat("ru-RU");

export type OrderStatusTone = "new" | "confirmed" | "in-progress" | "completed" | "cancelled";

export const formatOrderId = (orderId: string) => orderId.slice(0, 8).toUpperCase();

export const formatOrderStatus = (status: OrderStatus) => {
  switch (status) {
    case "new":
      return "Новая";
    case "confirmed":
      return "Подтверждена";
    case "in_progress":
      return "В работе";
    case "completed":
      return "Завершена";
    case "cancelled":
      return "Отменена";
    default:
      return "";
  }
};

export const getOrderStatusTone = (status: OrderStatus): OrderStatusTone => {
  switch (status) {
    case "new":
      return "new";
    case "confirmed":
      return "confirmed";
    case "in_progress":
      return "in-progress";
    case "completed":
      return "completed";
    case "cancelled":
      return "cancelled";
    default:
      return "new";
  }
};

export const formatOrderMoney = (value: number | null) => {
  if (value === null) {
    return "—";
  }

  return `${rubleFormatter.format(value)} ₽`;
};

export const formatOrderDateTime = (value: string | null) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const toDateTimeLocalValue = (value: string | null) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 16);
};

export const toIsoFromDateTimeLocal = (value: string) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};
