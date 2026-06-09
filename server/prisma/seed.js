require("dotenv/config");

const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const defaultServices = [
  {
    title: "Диагностика перед покупкой",
    category: "Диагностика",
    summary:
      "Проверим техническое состояние, кузов, пробег и историю автомобиля перед сделкой.",
    priceFrom: 3500,
    durationLabel: "2 часа",
    status: "active",
  },
  {
    title: "Подбор автомобиля под ключ",
    category: "Подбор",
    summary:
      "Возьмем на себя поиск, фильтрацию объявлений, переговоры с продавцами и финальную проверку автомобиля.",
    priceFrom: 18000,
    durationLabel: "до 7 дней",
    status: "active",
  },
  {
    title: "Выездная проверка автомобиля",
    category: "Выездная услуга",
    summary:
      "Специалист приедет к автомобилю, проведет осмотр на месте и подготовит понятный отчет с рекомендациями.",
    priceFrom: 6200,
    durationLabel: "3 часа",
    status: "active",
  },
  {
    title: "Экспертная консультация",
    category: "Консультация",
    summary:
      "Разберем спорную ситуацию по обслуживанию, ремонту или покупке и подскажем оптимальный следующий шаг.",
    priceFrom: 2000,
    durationLabel: "1 час",
    status: "active",
  },
  {
    title: "Компьютерная диагностика",
    category: "Диагностика",
    summary:
      "Считаем ошибки электронных блоков, проверим текущие параметры и поможем понять реальное состояние систем.",
    priceFrom: 2400,
    durationLabel: "50 минут",
    status: "active",
  },
  {
    title: "Диагностика ходовой части",
    category: "Диагностика",
    summary:
      "Проверим подвеску, амортизаторы, рулевое управление и выдадим рекомендации по ремонту.",
    priceFrom: 1800,
    durationLabel: "40 минут",
    status: "active",
  },
  {
    title: "Проверка двигателя эндоскопом",
    category: "Диагностика",
    summary:
      "Осмотрим цилиндры и внутренние поверхности двигателя без разбора, чтобы заранее увидеть риски.",
    priceFrom: 4200,
    durationLabel: "1 час",
    status: "active",
  },
  {
    title: "Замена моторного масла",
    category: "Техническое обслуживание",
    summary:
      "Подберем масло и фильтр, выполним замену и проверим базовое состояние подкапотного пространства.",
    priceFrom: 1600,
    durationLabel: "30 минут",
    status: "active",
  },
  {
    title: "Замена тормозных колодок",
    category: "Техническое обслуживание",
    summary:
      "Заменим колодки, оценим состояние дисков и дадим заключение по тормозной системе.",
    priceFrom: 2800,
    durationLabel: "1 час",
    status: "active",
  },
  {
    title: "Замена воздушного фильтра",
    category: "Техническое обслуживание",
    summary:
      "Быстро заменим воздушный фильтр и проверим чистоту корпуса воздухозабора.",
    priceFrom: 900,
    durationLabel: "20 минут",
    status: "active",
  },
  {
    title: "Предпродажная подготовка авто",
    category: "Подготовка",
    summary:
      "Поможем подготовить автомобиль к продаже: осмотр, рекомендации, список мелких доработок и фотофиксация.",
    priceFrom: 5400,
    durationLabel: "4 часа",
    status: "active",
  },
  {
    title: "Сопровождение сделки купли-продажи",
    category: "Подбор",
    summary:
      "Проверим документы, поможем на этапе расчета и снизим риски при оформлении сделки.",
    priceFrom: 7500,
    durationLabel: "1 день",
    status: "active",
  },
  {
    title: "Подготовка отчета для страховой",
    category: "Документы",
    summary:
      "Соберем фотофиксацию, оформим описание повреждений и подготовим комплект материалов для обращения.",
    priceFrom: 4500,
    durationLabel: "1 день",
    status: "draft",
  },
  {
    title: "Консультация по выбору комплектации",
    category: "Консультация",
    summary:
      "Сравним комплектации, расскажем про сильные и слабые стороны и поможем выбрать оптимальный вариант.",
    priceFrom: 2500,
    durationLabel: "45 минут",
    status: "draft",
  },
  {
    title: "Проверка автомобиля для автопарка",
    category: "Корпоративные услуги",
    summary:
      "Подготовим чек-лист и регламент проверки автомобиля для бизнеса, лизинга или внутреннего автопарка.",
    priceFrom: 9800,
    durationLabel: "1 день",
    status: "hidden",
  },
];

const syncDefaultServices = async () => {
  for (const serviceData of defaultServices) {
    const existingService = await prisma.service.findFirst({
      where: {
        title: serviceData.title,
        category: serviceData.category,
      },
      select: {
        id: true,
      },
    });

    if (existingService) {
      await prisma.service.update({
        where: {
          id: existingService.id,
        },
        data: serviceData,
      });

      continue;
    }

    await prisma.service.create({
      data: serviceData,
    });
  }
};

const main = async () => {
  await syncDefaultServices();

  const servicesCount = await prisma.service.count();
  console.log(`Seed completed. Services in catalog: ${servicesCount}`);
};

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
