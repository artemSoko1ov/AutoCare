import type { OrderDto } from "@shared/contracts/orders";
import type { ReviewDto } from "@shared/contracts/reviews";
import type { ServiceDto } from "@shared/contracts/services";
import type { AdminStat } from "./adminData";

const countFormatter = new Intl.NumberFormat("ru-RU");

type CreateAdminStatsArgs = {
  orders: OrderDto[];
  reviews: ReviewDto[];
  services: ServiceDto[];
};

const formatCount = (value: number) => countFormatter.format(value);

export const createAdminStats = ({
  orders,
  reviews,
  services,
}: CreateAdminStatsArgs): AdminStat[] => {
  const activeServicesCount = services.filter((service) => service.status === "active").length;

  return [
    {
      id: "requests-total",
      title: "Всего заявок",
      value: formatCount(orders.length),
      hint: "Все обращения, которые сейчас доступны в административном разделе",
      icon: "orders",
    },
    {
      id: "reviews-total",
      title: "Отзывов в системе",
      value: formatCount(reviews.length),
      hint: "Клиентские отзывы, которые можно просматривать и модерировать",
      icon: "star",
    },
    {
      id: "services-active",
      title: "Активных услуг",
      value: formatCount(activeServicesCount),
      hint: "Позиции каталога со статусом «active», доступные в публичной части",
      icon: "wrench",
    },
  ];
};
