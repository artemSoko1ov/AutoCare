import type { IconName } from "@/shared/ui/Icon";

export type AdminSidebarLink = {
  id: string;
  label: string;
  to: string;
  icon: IconName;
};

export type AdminStat = {
  id: string;
  title: string;
  value: string;
  hint: string;
  icon: IconName;
};

export type AdminRequestTone = "new" | "progress" | "done";

export type AdminRequest = {
  id: string;
  client: string;
  service: string;
  manager: string;
  createdAt: string;
  status: string;
  tone: AdminRequestTone;
};

export type AdminReview = {
  id: string;
  author: string;
  service: string;
  rating: string;
  comment: string;
  createdAt: string;
};

export type AdminServiceTone = "active" | "draft" | "hidden";

export type AdminService = {
  id: string;
  title: string;
  category: string;
  price: string;
  duration: string;
  status: string;
  tone: AdminServiceTone;
};

export const adminSidebarLinks: AdminSidebarLink[] = [
  {
    id: "dashboard",
    label: "Дашборд",
    to: "/admin/dashboard",
    icon: "briefcase",
  },
  {
    id: "requests",
    label: "Заявки",
    to: "/admin/requests",
    icon: "orders",
  },
  {
    id: "reviews",
    label: "Отзывы",
    to: "/admin/reviews",
    icon: "star",
  },
  {
    id: "services",
    label: "Услуги",
    to: "/admin/services",
    icon: "wrench",
  },
];

export const adminStats: AdminStat[] = [
  {
    id: "requests-total",
    title: "Всего заявок",
    value: "128",
    hint: "За последние 24 часа",
    icon: "orders",
  },
  {
    id: "reviews-total",
    title: "Новых отзывов",
    value: "46",
    hint: "За текущий месяц",
    icon: "star",
  },
  {
    id: "orders-active",
    title: "Активных заявок",
    value: "9",
    hint: "Сейчас в работе",
    icon: "briefcase",
  },
];

export const adminRequests: AdminRequest[] = [
  {
    id: "REQ-1001",
    client: "Александр Морозов",
    service: "Диагностика перед покупкой",
    manager: "Ирина Сергеева",
    createdAt: "07.06.2026",
    status: "Новая",
    tone: "new",
  },
  {
    id: "REQ-1002",
    client: "Мария Кузнецова",
    service: "Замена тормозных колодок",
    manager: "Дмитрий Волков",
    createdAt: "06.06.2026",
    status: "В работе",
    tone: "progress",
  },
  {
    id: "REQ-1003",
    client: "Илья Смирнов",
    service: "Подбор автомобиля под ключ",
    manager: "Анна Лебедева",
    createdAt: "05.06.2026",
    status: "Завершена",
    tone: "done",
  },
  {
    id: "REQ-1004",
    client: "Екатерина Иванова",
    service: "Компьютерная диагностика",
    manager: "Ирина Сергеева",
    createdAt: "04.06.2026",
    status: "В работе",
    tone: "progress",
  },
  {
    id: "REQ-1005",
    client: "Павел Новиков",
    service: "Экспертная консультация",
    manager: "Дмитрий Волков",
    createdAt: "03.06.2026",
    status: "Новая",
    tone: "new",
  },
];

export const adminReviews: AdminReview[] = [
  {
    id: "REV-201",
    author: "Александр Морозов",
    service: "Диагностика перед покупкой",
    rating: "5.0",
    comment: "Все подробно объяснили и быстро прислали отчет.",
    createdAt: "07.06.2026",
  },
  {
    id: "REV-202",
    author: "Мария Кузнецова",
    service: "Замена тормозных колодок",
    rating: "4.5",
    comment: "Работу сделали вовремя, сервис понравился.",
    createdAt: "06.06.2026",
  },
  {
    id: "REV-203",
    author: "Илья Смирнов",
    service: "Подбор автомобиля под ключ",
    rating: "5.0",
    comment: "Подобрали хороший автомобиль и сопровождали на всех этапах.",
    createdAt: "05.06.2026",
  },
  {
    id: "REV-204",
    author: "Екатерина Иванова",
    service: "Компьютерная диагностика",
    rating: "4.0",
    comment: "Понравилось отношение и понятные рекомендации после проверки.",
    createdAt: "04.06.2026",
  },
];

export const adminServices: AdminService[] = [
  {
    id: "SRV-301",
    title: "Диагностика перед покупкой",
    category: "Диагностика",
    price: "от 3 500 ₽",
    duration: "2 часа",
    status: "Активна",
    tone: "active",
  },
  {
    id: "SRV-302",
    title: "Подбор автомобиля под ключ",
    category: "Подбор",
    price: "от 18 000 ₽",
    duration: "до 7 дней",
    status: "Активна",
    tone: "active",
  },
  {
    id: "SRV-303",
    title: "Выездная проверка автомобиля",
    category: "Выездная услуга",
    price: "от 6 200 ₽",
    duration: "3 часа",
    status: "Черновик",
    tone: "draft",
  },
  {
    id: "SRV-304",
    title: "Экспертная консультация",
    category: "Консультация",
    price: "от 2 000 ₽",
    duration: "1 час",
    status: "Скрыта",
    tone: "hidden",
  },
];
