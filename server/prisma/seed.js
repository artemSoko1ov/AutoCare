const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

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
    status: "draft",
  },
  {
    title: "Подготовка отчета для страховой",
    category: "Документы",
    summary:
      "Соберем фотофиксацию, оформим описание повреждений и подготовим комплект материалов для обращения.",
    priceFrom: 4500,
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
