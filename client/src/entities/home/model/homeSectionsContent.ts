import type { IconName } from "@/shared/ui/Icon";

export type HomeProcessStep = {
  id: string;
  icon: IconName;
  stepLabel: string;
  title: string;
  text: string;
  detail: string;
};

export type HomeProcessSupportItem = {
  id: string;
  icon: IconName;
  title: string;
  text: string;
};

export type HomeBenefitMetric = {
  id: string;
  value: string;
  label: string;
  note: string;
  icon: IconName;
};

export type HomeBenefitItem = {
  id: string;
  icon: IconName;
  title: string;
  text: string;
};

export const homeProcessSteps: HomeProcessStep[] = [
  {
    id: "select-service",
    icon: "wrench",
    stepLabel: "Шаг 1",
    title: "Выбираете услугу под свою задачу",
    text: "На странице услуг можно быстро понять формат работ, длительность и ориентир по стоимости без лишних звонков.",
    detail: "Каталог с описанием и понятными карточками",
  },
  {
    id: "create-request",
    icon: "orders",
    stepLabel: "Шаг 2",
    title: "Оставляете заявку в удобном формате",
    text: "Указываете автомобиль, желаемое время и комментарий. Менеджер связывается с вами для подтверждения деталей.",
    detail: "Заявка оформляется в пару шагов",
  },
  {
    id: "get-result",
    icon: "check-circle",
    stepLabel: "Шаг 3",
    title: "Получаете понятный итог и рекомендации",
    text: "После обращения у вас остается история по машине, статус заявки и понятный следующий шаг без потери информации.",
    detail: "Все фиксируется в личном кабинете",
  },
];

export const homeProcessSupportItems: HomeProcessSupportItem[] = [
  {
    id: "garage",
    icon: "car",
    title: "Гараж всегда под рукой",
    text: "Добавляйте автомобили один раз и используйте их при новых заявках без повторного ввода данных.",
  },
  {
    id: "status",
    icon: "clock",
    title: "Прозрачный статус обращения",
    text: "Видно, что создано, что в работе, а что уже завершено, без бесконечных уточняющих сообщений.",
  },
  {
    id: "support",
    icon: "support",
    title: "Живая связь с сервисом",
    text: "Можно быстро уточнить нюансы по телефону, почте или через удобный маршрут до офиса.",
  },
];

export const homeBenefitMetrics: HomeBenefitMetric[] = [
  {
    id: "services-count",
    value: "15+",
    label: "актуальных услуг",
    note: "От диагностики до сопровождения сделки и регулярного обслуживания.",
    icon: "wrench",
  },
  {
    id: "working-hours",
    value: "9:00 - 21:00",
    label: "ежедневно на связи",
    note: "Подбираем удобное время визита и не ограничиваемся коротким окном записи.",
    icon: "clock",
  },
  {
    id: "single-cabinet",
    value: "1 кабинет",
    label: "для машин и заявок",
    note: "Профиль, отзывы, автомобили и история обращений собираются в одном месте.",
    icon: "user",
  },
];

export const homeBenefitItems: HomeBenefitItem[] = [
  {
    id: "requests",
    icon: "orders",
    title: "Заявки без хаоса",
    text: "Каждое обращение хранится в системе с понятным статусом, комментарием и данными автомобиля.",
  },
  {
    id: "garage",
    icon: "car",
    title: "История по автомобилю",
    text: "Машины сохраняются в гараже, а важные данные по заявке фиксируются в снимке автомобиля.",
  },
  {
    id: "pricing",
    icon: "wallet",
    title: "Понятная стоимость",
    text: "На карточках услуг сразу виден ориентир по цене и длительности, без непонятных формулировок.",
  },
  {
    id: "reviews",
    icon: "star",
    title: "Отзывы после завершения работ",
    text: "Клиент может оставить оценку и комментарий, а новые пользователи видят реальный опыт по услугам.",
  },
];
