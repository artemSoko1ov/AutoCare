import type { OrderDto } from "@shared/contracts/orders";
import type { IconName } from "@/shared/ui/Icon";
import {
  formatOrderDateTime,
  formatOrderMoney,
  formatOrderStatus,
  getOrderStatusTone,
} from "./order.formatters";

type OrderAccent = "blue" | "green" | "amber" | "violet" | "rose" | "slate";

export type ProfileOrderStatusTone = "success" | "warning";

export type ProfileOrderItem = {
  id: string;
  title: string;
  meta: string;
  date: string;
  price: string;
  statusLabel: string;
  statusTone: ProfileOrderStatusTone;
  icon: IconName;
  accent: OrderAccent;
};

export type ProfileOrdersSection = {
  title: string;
  actionLabel: string;
  actionTo?: string;
  items: ProfileOrderItem[];
};

export type ProfileOrdersPageStatItem = {
  id: string;
  value: string;
  label: string;
  description: string;
  icon: IconName;
  accent: OrderAccent;
};

export type ProfileOrdersPageItem = {
  id: string;
  title: string;
  meta: string;
  createdAt: string;
  scheduledFor: string;
  price: string;
  statusLabel: string;
  statusTone: ProfileOrderStatusTone;
  notes: string | null;
  accent: OrderAccent;
};

export type ProfileOrdersPageSection = {
  title: string;
  description: string;
  stats: ProfileOrdersPageStatItem[];
  items: ProfileOrdersPageItem[];
};

const accents: OrderAccent[] = ["amber", "slate", "blue", "green", "violet", "rose"];

const getAccent = (index: number): OrderAccent => {
  return accents[index % accents.length] ?? "amber";
};

const getProfileOrderTone = (order: OrderDto): ProfileOrderStatusTone => {
  const tone = getOrderStatusTone(order.status);

  if (tone === "completed") {
    return "success";
  }

  return "warning";
};

const getOrderPrice = (order: OrderDto) => {
  if (order.quotedPrice !== null) {
    return formatOrderMoney(order.quotedPrice);
  }

  return `от ${formatOrderMoney(order.service.priceFrom)}`;
};

export const createProfileOrdersSection = (orders: OrderDto[]): ProfileOrdersSection => {
  return {
    title: "Последние заказы",
    actionLabel: "Смотреть все",
    actionTo: "/profile/orders",
    items: orders.slice(0, 4).map((order, index) => ({
      id: order.id,
      title: order.service.title,
      meta: `${order.carSnapshot.brand} ${order.carSnapshot.model} · ${order.carSnapshot.plateNumber}`,
      date: formatOrderDateTime(order.scheduledFor ?? order.createdAt),
      price: getOrderPrice(order),
      statusLabel: formatOrderStatus(order.status),
      statusTone: getProfileOrderTone(order),
      icon: "wrench",
      accent: getAccent(index),
    })),
  };
};

export const createProfileOrdersPageSection = (orders: OrderDto[]): ProfileOrdersPageSection => {
  const activeOrdersCount = orders.filter((order) => {
    return !["completed", "cancelled"].includes(order.status);
  }).length;
  const completedOrdersCount = orders.filter((order) => order.status === "completed").length;

  return {
    title: "Мои заказы",
    description:
      "Здесь собраны все обращения в сервис: статус, автомобиль, стоимость и согласованное время визита.",
    stats: [
      {
        id: "orders-total",
        value: String(orders.length),
        label: "Заказов всего",
        description: "Все обращения, созданные из вашего профиля",
        icon: "orders",
        accent: "blue",
      },
      {
        id: "orders-active",
        value: String(activeOrdersCount),
        label: "Активных сейчас",
        description: "Новые, подтвержденные и заказы в работе",
        icon: "clock",
        accent: "amber",
      },
      {
        id: "orders-completed",
        value: String(completedOrdersCount),
        label: "Завершено",
        description: "Успешно выполненные работы и закрытые обращения",
        icon: "check-circle",
        accent: "green",
      },
    ],
    items: orders.map((order, index) => ({
      id: order.id,
      title: order.service.title,
      meta: `${order.carSnapshot.brand} ${order.carSnapshot.model} · ${order.carSnapshot.plateNumber}`,
      createdAt: formatOrderDateTime(order.createdAt),
      scheduledFor: formatOrderDateTime(order.scheduledFor),
      price: getOrderPrice(order),
      statusLabel: formatOrderStatus(order.status),
      statusTone: getProfileOrderTone(order),
      notes: order.notes,
      accent: getAccent(index),
    })),
  };
};
