import type { OrderDto } from "@shared/contracts/orders";
import type { ProfileStatItem } from "./profile.mocks";

const countCompletedOrders = (orders: OrderDto[]) =>
  orders.filter((order) => order.status === "completed").length;

const countActiveOrders = (orders: OrderDto[]) =>
  orders.filter((order) => ["confirmed", "in_progress"].includes(order.status)).length;

type CreateProfileOverviewStatsArgs = {
  orders?: OrderDto[];
  reviewsCount?: number;
};

export const createProfileOverviewStats = ({
  orders = [],
  reviewsCount = 0,
}: CreateProfileOverviewStatsArgs): ProfileStatItem[] => {
  return [
    {
      id: "orders-total",
      value: String(orders.length),
      label: "Заявок всего отправлено",
      description: "Все обращения в сервис",
      icon: "briefcase",
      accent: "blue",
    },
    {
      id: "orders-done",
      value: String(countCompletedOrders(orders)),
      label: "Завершено заявок",
      description: "Успешно выполненные работы",
      icon: "check-circle",
      accent: "green",
    },
    {
      id: "orders-progress",
      value: String(countActiveOrders(orders)),
      label: "В процессе заявка",
      description: "Текущие активные работы",
      icon: "clock",
      accent: "amber",
    },
    {
      id: "reviews-total",
      value: String(reviewsCount),
      label: "Отзывы оставлено",
      description: "Оценки и обратная связь",
      icon: "star",
      accent: "violet",
    },
  ];
};
