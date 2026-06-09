import type { UserDto } from "@shared/contracts/auth";
import type { IconName } from "@/shared/ui/Icon";

export type ProfileAccent = "blue" | "green" | "amber" | "violet" | "rose" | "slate";
export type OrderStatusTone = "success" | "warning";

export type ProfileSidebarItem = {
  id: string;
  label: string;
  icon: IconName;
  to?: string;
};

export type ProfileContactItem = {
  id: string;
  label: string;
  value: string;
  icon: IconName;
};

export type ProfileStatItem = {
  id: string;
  value: string;
  label: string;
  description: string;
  icon: IconName;
  accent: ProfileAccent;
};

export type ProfileOrderItem = {
  id: string;
  title: string;
  meta: string;
  date: string;
  price: string;
  statusLabel: string;
  statusTone: OrderStatusTone;
  icon: IconName;
  accent: ProfileAccent;
};

export type ProfileCarItem = {
  id: string;
  name: string;
  plate: string;
  details: string;
  icon: IconName;
  accent: ProfileAccent;
};

export type ProfileCarsStatItem = {
  id: string;
  value: string;
  label: string;
  description: string;
  icon: IconName;
  accent: ProfileAccent;
};

export type ProfileGarageVehicleItem = {
  id: string;
  name: string;
  plate: string;
  year: string;
  mileage: string;
  statusLabel: string;
  nextService: string;
  lastVisit: string;
  vin: string;
  accent: ProfileAccent;
};

export type ProfileFavoriteServiceItem = {
  id: string;
  title: string;
  price: string;
};

export type ProfileReviewItem = {
  id: string;
  title: string;
  date: string;
  rating: number;
  text: string;
  icon: IconName;
  accent: ProfileAccent;
};

export type ProfileDashboardData = {
  pageTitle: string;
  editLabel: string;
  profile: {
    fullName: string;
    membershipLabel: string;
    joinedLabel: string;
    email: string;
    phone: string;
    address: string;
    initials: string;
    avatarUrl: string | null;
    contacts: ProfileContactItem[];
  };
  sidebarItems: ProfileSidebarItem[];
  stats: ProfileStatItem[];
  ordersSection: {
    title: string;
    actionLabel: string;
    items: ProfileOrderItem[];
  };
  garageSection: {
    title: string;
    actionLabel: string;
    actionTo?: string;
    addLabel: string;
    items: ProfileCarItem[];
  };
  favoritesSection: {
    title: string;
    actionLabel: string;
    items: ProfileFavoriteServiceItem[];
  };
  reviewsSection: {
    title: string;
    actionLabel: string;
    items: ProfileReviewItem[];
  };
};

export type ProfileCarsPageData = {
  title: string;
  description: string;
  addLabel: string;
  stats: ProfileCarsStatItem[];
  items: ProfileGarageVehicleItem[];
};

const monthNames = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

const getInitials = (fullName: string) =>
  fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

const formatMembershipLabel = (createdAt?: string) => {
  if (!createdAt) {
    return "Участник с мая 2024";
  }

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "Участник с мая 2024";
  }

  return `Участник с ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};

export const createProfileDashboardData = (user: UserDto | null): ProfileDashboardData => {
  const fullName = user ? user.username.trim() || "Пользователь" : "Иван Петров";
  const email = user?.email || "ivan.petrov@email.com";
  const phone = user ? (user.phone ?? "") : "+7 (999) 123-45-67";
  const phoneDisplay = phone || "Не указан";
  const address = "г. Москва, ул. Ленина, 15";
  const membershipLabel = user?.role === "ADMIN" ? "Администратор" : "Постоянный клиент";

  return {
    pageTitle: "Профиль",
    editLabel: "Редактировать профиль",
    profile: {
      fullName,
      membershipLabel,
      joinedLabel: formatMembershipLabel(user?.createdAt),
      email,
      phone,
      address,
      initials: getInitials(fullName) || "ИП",
      avatarUrl: user?.avatarUrl ?? null,
      contacts: [
        {
          id: "email",
          label: "Email",
          value: email,
          icon: "mail",
        },
        {
          id: "phone",
          label: "Телефон",
          value: phoneDisplay,
          icon: "phone",
        },
        {
          id: "address",
          label: "Адрес",
          value: address,
          icon: "map-pin",
        },
      ],
    },
    sidebarItems: [
      { id: "profile", label: "Профиль", icon: "user", to: "/profile" },
      { id: "cars", label: "Мои автомобили", icon: "car", to: "/profile/cars" },
      { id: "orders", label: "Мои заявки", icon: "orders", to: "/profile/requests" },
      { id: "favorites", label: "Избранные услуги", icon: "heart" },
      { id: "reviews", label: "Отзывы", icon: "star" },
      { id: "notifications", label: "Уведомления", icon: "bell" },
      { id: "settings", label: "Настройки", icon: "settings" },
    ],
    stats: [
      {
        id: "orders-total",
        value: "8",
        label: "Заявок всего отправлено",
        description: "Все обращения в сервис",
        icon: "briefcase",
        accent: "blue",
      },
      {
        id: "orders-done",
        value: "6",
        label: "Завершено заявок",
        description: "Успешно выполненные работы",
        icon: "check-circle",
        accent: "green",
      },
      {
        id: "orders-progress",
        value: "1",
        label: "В процессе заявка",
        description: "Текущие активные работы",
        icon: "clock",
        accent: "amber",
      },
      {
        id: "reviews-total",
        value: "12",
        label: "Отзывы оставлено",
        description: "Оценки и обратная связь",
        icon: "star",
        accent: "violet",
      },
    ],
    ordersSection: {
      title: "Последние заявки",
      actionLabel: "Смотреть все",
      items: [
        {
          id: "order-1",
          title: "Замена моторного масла",
          meta: "Toyota Camry • A123BC77",
          date: "15 мая 2024",
          price: "2 500 ₽",
          statusLabel: "Завершено",
          statusTone: "success",
          icon: "wrench",
          accent: "amber",
        },
        {
          id: "order-2",
          title: "Замена тормозных колодок",
          meta: "Toyota Camry • A123BC77",
          date: "2 мая 2024",
          price: "4 800 ₽",
          statusLabel: "Завершено",
          statusTone: "success",
          icon: "wrench",
          accent: "slate",
        },
        {
          id: "order-3",
          title: "Компьютерная диагностика",
          meta: "Toyota Camry • A123BC77",
          date: "28 апреля 2024",
          price: "1 200 ₽",
          statusLabel: "Завершено",
          statusTone: "success",
          icon: "wrench",
          accent: "blue",
        },
        {
          id: "order-4",
          title: "Замена воздушного фильтра",
          meta: "Toyota Camry • A123BC77",
          date: "20 мая 2024",
          price: "850 ₽",
          statusLabel: "В процессе",
          statusTone: "warning",
          icon: "wrench",
          accent: "green",
        },
      ],
    },
    garageSection: {
      title: "Мои автомобили",
      actionLabel: "Все автомобили",
      actionTo: "/profile/cars",
      addLabel: "Добавить автомобиль",
      items: [
        {
          id: "car-1",
          name: "Toyota Camry",
          plate: "A123BC77",
          details: "2018 • 65 000 км",
          icon: "car",
          accent: "blue",
        },
        {
          id: "car-2",
          name: "BMW X5",
          plate: "B456DE77",
          details: "2020 • 35 000 км",
          icon: "car",
          accent: "slate",
        },
      ],
    },
    favoritesSection: {
      title: "Избранные услуги",
      actionLabel: "Все услуги",
      items: [
        { id: "favorite-1", title: "Замена моторного масла", price: "от 2 500 ₽" },
        { id: "favorite-2", title: "Компьютерная диагностика", price: "от 1 200 ₽" },
        { id: "favorite-3", title: "Замена тормозных колодок", price: "от 4 800 ₽" },
      ],
    },
    reviewsSection: {
      title: "Последние отзывы",
      actionLabel: "Все отзывы",
      items: [
        {
          id: "review-1",
          title: "Замена моторного масла",
          date: "15 мая 2024",
          rating: 5,
          text: "Отличный сервис! Быстро и качественно заменили масло. Рекомендую!",
          icon: "wrench",
          accent: "amber",
        },
        {
          id: "review-2",
          title: "Замена тормозных колодок",
          date: "2 мая 2024",
          rating: 4,
          text: "Хорошая работа, адекватные цены. Буду обращаться еще.",
          icon: "wrench",
          accent: "slate",
        },
      ],
    },
  };
};

export const createProfileCarsPageData = (): ProfileCarsPageData => ({
  title: "Мои автомобили",
  description:
    "Следите за текущим состоянием машин, пробегом и ближайшими визитами в сервис. Пока раздел работает на моковых данных, но структура уже готова под реальный гараж пользователя.",
  addLabel: "Добавить автомобиль",
  stats: [
    {
      id: "cars-total",
      value: "3",
      label: "Автомобиля в профиле",
      description: "Все машины, привязанные к аккаунту",
      icon: "car",
      accent: "blue",
    },
    {
      id: "cars-active-service",
      value: "1",
      label: "Сейчас в работе",
      description: "Есть активная запись в сервис",
      icon: "orders",
      accent: "amber",
    },
    {
      id: "cars-next-service",
      value: "1 200 км",
      label: "До ближайшего ТО",
      description: "Напоминание по основному автомобилю",
      icon: "clock",
      accent: "green",
    },
  ],
  items: [
    {
      id: "garage-car-1",
      name: "Toyota Camry",
      plate: "A123BC77",
      year: "2018",
      mileage: "65 000 км",
      statusLabel: "Основной автомобиль",
      nextService: "Через 1 200 км",
      lastVisit: "15 мая 2024",
      vin: "XW7BF4FK90S123456",
      accent: "blue",
    },
    {
      id: "garage-car-2",
      name: "BMW X5",
      plate: "B456DE77",
      year: "2020",
      mileage: "35 000 км",
      statusLabel: "Ожидает запись",
      nextService: "Плановое ТО в июне",
      lastVisit: "2 мая 2024",
      vin: "WBAJU61040L654321",
      accent: "slate",
    },
    {
      id: "garage-car-3",
      name: "Kia Sportage",
      plate: "E777KK174",
      year: "2021",
      mileage: "28 400 км",
      statusLabel: "На диагностике",
      nextService: "Сегодня, 18:30",
      lastVisit: "20 апреля 2024",
      vin: "KNDPB3AC5M7123456",
      accent: "green",
    },
  ],
});
