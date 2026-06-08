import type { CarDto } from "@shared/contracts/cars";
import type { IconName } from "@/shared/ui/Icon";

type CarAccent = "blue" | "green" | "amber" | "violet" | "rose" | "slate";

export type ProfileGarageCarItem = {
  id: string;
  name: string;
  plate: string;
  details: string;
  accent: CarAccent;
};

export type ProfileGarageSection = {
  title: string;
  actionLabel: string;
  actionTo?: string;
  addLabel: string;
  items: ProfileGarageCarItem[];
};

export type ProfileCarsStatItem = {
  id: string;
  value: string;
  label: string;
  description: string;
  icon: IconName;
  accent: CarAccent;
};

export type ProfileCarsItem = {
  id: string;
  name: string;
  plate: string;
  year: string;
  mileage: string;
  vin: string;
  createdAt: string;
  accent: CarAccent;
};

export type ProfileCarsSection = {
  title: string;
  description: string;
  addLabel: string;
  stats: ProfileCarsStatItem[];
  items: ProfileCarsItem[];
};

const accents: CarAccent[] = ["blue", "slate", "green", "amber", "violet", "rose"];

const getAccent = (index: number): CarAccent => {
  return accents[index % accents.length] ?? "blue";
};

const formatMileage = (value: number) => {
  return `${new Intl.NumberFormat("ru-RU").format(value)} км`;
};

const formatDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Нет данных";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const getDisplayName = (car: CarDto) => {
  return `${car.brand} ${car.model}`.trim();
};

export const createProfileGarageSection = (cars: CarDto[]): ProfileGarageSection => {
  return {
    title: "Мои автомобили",
    actionLabel: "Все автомобили",
    actionTo: "/profile/cars",
    addLabel: "Добавить автомобиль",
    items: cars.slice(0, 2).map((car, index) => ({
      id: car.id,
      name: getDisplayName(car),
      plate: car.licensePlate,
      details: `${car.year} • ${formatMileage(car.mileage)}`,
      accent: getAccent(index),
    })),
  };
};

export const createProfileCarsSection = (cars: CarDto[]): ProfileCarsSection => {
  const totalMileage = cars.reduce((sum, car) => sum + car.mileage, 0);
  const averageMileage = cars.length > 0 ? Math.round(totalMileage / cars.length) : 0;
  const carsWithVin = cars.filter((car) => car.vin).length;

  return {
    title: "Мои автомобили",
    description:
      "Здесь отображаются автомобили, которые привязаны к вашему аккаунту и доступны для записи в сервис.",
    addLabel: "Добавить автомобиль",
    stats: [
      {
        id: "cars-total",
        value: String(cars.length),
        label: "Автомобилей в гараже",
        description: "Подключено к вашему профилю",
        icon: "car",
        accent: "blue",
      },
      {
        id: "cars-vin",
        value: String(carsWithVin),
        label: "VIN указан",
        description: "Карточки с полными данными",
        icon: "check-circle",
        accent: "green",
      },
      {
        id: "cars-mileage",
        value: formatMileage(averageMileage),
        label: "Средний пробег",
        description: "По всем автомобилям в профиле",
        icon: "clock",
        accent: "amber",
      },
    ],
    items: cars.map((car, index) => ({
      id: car.id,
      name: getDisplayName(car),
      plate: car.licensePlate,
      year: String(car.year),
      mileage: formatMileage(car.mileage),
      vin: car.vin ?? "Не указан",
      createdAt: formatDate(car.createdAt),
      accent: getAccent(index),
    })),
  };
};
