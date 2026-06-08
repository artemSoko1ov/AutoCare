import type { IconName } from "@/shared/ui/Icon";

export type HomeHeroFeature = {
  id: string;
  icon: IconName;
  title: string;
  description: string;
};

export type HomeHeroAction = {
  label: string;
  to: string;
  icon: IconName;
};

export type HomeHeroContent = {
  eyebrow: string;
  title: {
    primary: string;
    secondary: string;
    accent: string;
  };
  description: string;
  primaryAction: HomeHeroAction;
  secondaryAction: HomeHeroAction;
  features: HomeHeroFeature[];
};

export const homeHeroContent: HomeHeroContent = {
  eyebrow: "Умный сервис для вашего автомобиля",
  title: {
    primary: "Управляйте",
    secondary: "обслуживанием авто",
    accent: "легко",
  },
  description:
    "Записывайтесь в автосервис, отслеживайте ТО, получайте рекомендации и заботьтесь о машине в одном месте.",
  primaryAction: {
    label: "Записаться в сервис",
    to: "/services",
    icon: "orders",
  },
  secondaryAction: {
    label: "Как это работает",
    to: "/contacts",
    icon: "play",
  },
  features: [
    {
      id: "feature-speed",
      icon: "clock",
      title: "Быстрая запись",
      description: "за 2 минуты",
    },
    {
      id: "feature-pricing",
      icon: "check-circle",
      title: "Прозрачные цены",
      description: "без скрытых платежей",
    },
    {
      id: "feature-trust",
      icon: "shield",
      title: "Проверенные СТО",
      description: "рейтинг и отзывы",
    },
  ],
};
