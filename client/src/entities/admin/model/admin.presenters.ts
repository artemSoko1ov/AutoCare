import type { OrderDto } from "@shared/contracts/orders";
import type { ReviewDto } from "@shared/contracts/reviews";
import type { AdminStat } from "./adminData";

const countFormatter = new Intl.NumberFormat("ru-RU");
const ratingFormatter = new Intl.NumberFormat("ru-RU", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

type CreateAdminStatsArgs = {
  orders: OrderDto[];
  reviews: ReviewDto[];
};

const formatCount = (value: number) => countFormatter.format(value);
const formatRating = (value: number) => ratingFormatter.format(value);

export const createAdminStats = ({ orders, reviews }: CreateAdminStatsArgs): AdminStat[] => {
  const inProgressOrdersCount = orders.filter(
    (order) => order.status === "confirmed" || order.status === "in_progress",
  ).length;
  const completedOrdersCount = orders.filter((order) => order.status === "completed").length;
  const cancelledOrdersCount = orders.filter((order) => order.status === "cancelled").length;
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return [
    {
      id: "requests-in-progress",
      title: "Заявки в работе",
      value: formatCount(inProgressOrdersCount),
      hint: "Подтвержденные обращения и заявки, которые уже выполняются",
      icon: "briefcase",
    },
    {
      id: "requests-completed",
      title: "Завершенные заявки",
      value: formatCount(completedOrdersCount),
      hint: "Обращения, которые успешно закрыты и завершены в системе",
      icon: "check-circle",
    },
    {
      id: "requests-cancelled",
      title: "Отмененные заявки",
      value: formatCount(cancelledOrdersCount),
      hint: "Обращения, которые были отменены и не дошли до выполнения",
      icon: "x-mark",
    },
    {
      id: "reviews-total",
      title: "Количество отзывов",
      value: formatCount(reviews.length),
      hint: "Все отзывы, которые сейчас есть в системе и доступны для админки",
      icon: "star",
    },
    {
      id: "reviews-average-rating",
      title: "Средний рейтинг отзывов",
      value: formatRating(averageRating),
      hint: "Средняя клиентская оценка по всем отзывам в системе",
      icon: "heart",
    },
  ];
};
