require("dotenv/config");

const { createHash } = require("node:crypto");
const bcrypt = require("bcryptjs");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const normalizeSlugValue = (value) => {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
};

const createServiceSlug = (title, category) => {
  const hash = createHash("md5")
    .update(`${normalizeSlugValue(title)}|${normalizeSlugValue(category)}`)
    .digest("hex")
    .slice(0, 16);

  return `service-${hash}`;
};

const defaultServices = [
  {
    title: "Диагностика перед покупкой",
    category: "Диагностика",
    summary:
      "Проверим техническое состояние, кузов, пробег и историю автомобиля перед сделкой.",
    iconPath: "/icons/services/magnifying-glass-plus.svg",
    includedItems: [
      "Проверка кузова, салона и ключевых элементов безопасности перед покупкой.",
      "Диагностика двигателя, коробки передач и электронных систем с фиксацией рисков.",
      "Проверка документов, пробега и доступной истории автомобиля по открытым данным.",
    ],
    workflowSteps: [
      "Сначала обсуждаем автомобиль, ссылку на объявление и ваши ожидания по покупке.",
      "Потом проводим полный осмотр машины на месте или в согласованном сервисе.",
      "В конце передаем понятное заключение с рисками, плюсами и рекомендацией по сделке.",
    ],
    priceFrom: 3500,
    durationLabel: "2 часа",
    status: "active",
  },
  {
    title: "Подбор автомобиля под ключ",
    category: "Подбор",
    summary:
      "Возьмем на себя поиск, фильтрацию объявлений, переговоры с продавцами и финальную проверку автомобиля.",
    iconPath: "/icons/services/user-group.svg",
    includedItems: [
      "Формирование стратегии подбора под ваш бюджет, задачи и желаемую комплектацию.",
      "Фильтрация объявлений, первичный отсев слабых вариантов и переговоры с продавцами.",
      "Финальная проверка выбранных автомобилей и сопровождение до принятия решения.",
    ],
    workflowSteps: [
      "Сначала собираем подробный бриф: бюджет, сценарий эксплуатации и пожелания к машине.",
      "Потом ищем и согласовываем shortlist из действительно подходящих вариантов.",
      "В конце проверяем финальный автомобиль и сопровождаем вас до выхода на сделку.",
    ],
    priceFrom: 18000,
    durationLabel: "до 7 дней",
    status: "active",
  },
  {
    title: "Выездная проверка автомобиля",
    category: "Выездная услуга",
    summary:
      "Специалист приедет к автомобилю, проведет осмотр на месте и подготовит понятный отчет с рекомендациями.",
    iconPath: "/icons/services/map-pin.svg",
    includedItems: [
      "Выезд специалиста к автомобилю по согласованному адресу и времени.",
      "Осмотр кузова, салона, основных узлов и фотофиксация найденных особенностей.",
      "Краткий отчет с выводами, чтобы вы быстро приняли решение по варианту.",
    ],
    workflowSteps: [
      "Сначала вы присылаете объявление, контакты продавца и удобный слот для проверки.",
      "Потом специалист выезжает на место и проводит согласованный объем осмотра.",
      "В конце вы получаете отчет, фото и устные рекомендации по дальнейшим действиям.",
    ],
    priceFrom: 6200,
    durationLabel: "3 часа",
    status: "active",
  },
  {
    title: "Экспертная консультация",
    category: "Консультация",
    summary:
      "Разберем спорную ситуацию по обслуживанию, ремонту или покупке и подскажем оптимальный следующий шаг.",
    iconPath: "/icons/services/question-mark-circle.svg",
    includedItems: [
      "Разбор вашей ситуации с учетом симптомов, бюджета и состояния автомобиля.",
      "Пояснение, какие работы действительно нужны сейчас, а что можно отложить.",
      "Рекомендации по следующему шагу без навязывания лишних услуг и расходов.",
    ],
    workflowSteps: [
      "Сначала собираем вводные: описание проблемы, фото, документы или прошлые рекомендации.",
      "Потом разбираем ситуацию и объясняем возможные сценарии простым языком.",
      "В конце даем конкретный план действий, чтобы вы понимали, куда двигаться дальше.",
    ],
    priceFrom: 2000,
    durationLabel: "1 час",
    status: "active",
  },
  {
    title: "Компьютерная диагностика",
    category: "Диагностика",
    summary:
      "Считаем ошибки электронных блоков, проверим текущие параметры и поможем понять реальное состояние систем.",
    iconPath: "/icons/services/magnifying-glass-plus.svg",
    includedItems: [
      "Считывание ошибок по основным электронным блокам автомобиля.",
      "Проверка текущих параметров работы систем в реальном времени.",
      "Пояснение, какие ошибки критичны, а какие носят информационный характер.",
    ],
    workflowSteps: [
      "Сначала подключаем диагностическое оборудование и определяем конфигурацию автомобиля.",
      "Потом считываем ошибки, анализируем параметры и сопоставляем их с симптомами.",
      "В конце объясняем результаты и рекомендуем приоритетные дальнейшие работы.",
    ],
    priceFrom: 2400,
    durationLabel: "50 минут",
    status: "active",
  },
  {
    title: "Диагностика ходовой части",
    category: "Диагностика",
    summary:
      "Проверим подвеску, амортизаторы, рулевое управление и выдадим рекомендации по ремонту.",
    iconPath: "/icons/services/wrench-screwdriver.svg",
    includedItems: [
      "Осмотр подвески, амортизаторов, сайлентблоков и элементов рулевого управления.",
      "Проверка люфтов, износа и потенциальных источников шума или вибраций.",
      "Заключение с приоритетами по ремонту и понятной очередностью работ.",
    ],
    workflowSteps: [
      "Сначала уточняем жалобы на поведение автомобиля и историю недавнего ремонта.",
      "Потом поднимаем машину, осматриваем ходовую и фиксируем все замечания.",
      "В конце объясняем, что требует срочного вмешательства, а что можно планировать позже.",
    ],
    priceFrom: 1800,
    durationLabel: "40 минут",
    status: "active",
  },
  {
    title: "Проверка двигателя эндоскопом",
    category: "Диагностика",
    summary:
      "Осмотрим цилиндры и внутренние поверхности двигателя без разбора, чтобы заранее увидеть риски.",
    iconPath: "/icons/services/exclamation-triangle.svg",
    includedItems: [
      "Эндоскопический осмотр цилиндров и внутренних поверхностей без разборки двигателя.",
      "Оценка наличия задиров, нагара, следов перегрева и других тревожных признаков.",
      "Рекомендации по дальнейшей диагностике или отказу от рискованной покупки.",
    ],
    workflowSteps: [
      "Сначала согласовываем применимость проверки под конкретный двигатель и доступ к свечным колодцам.",
      "Потом проводим эндоскопию и фиксируем ключевые кадры по каждому цилиндру.",
      "В конце обсуждаем результаты и объясняем, насколько безопасна дальнейшая эксплуатация.",
    ],
    priceFrom: 4200,
    durationLabel: "1 час",
    status: "active",
  },
  {
    title: "Замена моторного масла",
    category: "Техническое обслуживание",
    summary:
      "Подберем масло и фильтр, выполним замену и проверим базовое состояние подкапотного пространства.",
    iconPath: "/icons/services/wrench.svg",
    includedItems: [
      "Подбор подходящего масла и фильтра под ваш двигатель и режим эксплуатации.",
      "Замена масла с контролем уровня и проверкой состояния сливной зоны.",
      "Короткий осмотр подкапотного пространства после завершения обслуживания.",
    ],
    workflowSteps: [
      "Сначала уточняем масло, пробег и интервалы предыдущего обслуживания.",
      "Потом выполняем замену расходников и проверяем герметичность после работ.",
      "В конце фиксируем результат и подсказываем ориентир по следующему сервисному визиту.",
    ],
    priceFrom: 1600,
    durationLabel: "30 минут",
    status: "active",
  },
  {
    title: "Замена тормозных колодок",
    category: "Техническое обслуживание",
    summary:
      "Заменим колодки, оценим состояние дисков и дадим заключение по тормозной системе.",
    iconPath: "/icons/services/shield-exclamation.svg",
    includedItems: [
      "Замена тормозных колодок с соблюдением требований по узлу и крепежу.",
      "Осмотр тормозных дисков, направляющих и состояния суппортов.",
      "Проверка работы тормозной системы после завершения обслуживания.",
    ],
    workflowSteps: [
      "Сначала осматриваем текущее состояние тормозных механизмов и согласовываем объем работ.",
      "Потом меняем колодки, обслуживаем посадочные зоны и проверяем смежные элементы.",
      "В конце делаем итоговую проверку и объясняем, на что обратить внимание после замены.",
    ],
    priceFrom: 2800,
    durationLabel: "1 час",
    status: "active",
  },
  {
    title: "Замена воздушного фильтра",
    category: "Техническое обслуживание",
    summary:
      "Быстро заменим воздушный фильтр и проверим чистоту корпуса воздухозабора.",
    iconPath: "/icons/services/funnel.svg",
    includedItems: [
      "Замена воздушного фильтра на подходящий расходный материал.",
      "Очистка корпуса фильтра и проверка правильности посадки элемента.",
      "Краткий осмотр состояния соседних впускных элементов при доступе.",
    ],
    workflowSteps: [
      "Сначала проверяем текущий фильтр и совместимость нового элемента.",
      "Потом выполняем замену и очищаем посадочное место от пыли и мусора.",
      "В конце убеждаемся, что корпус закрыт корректно, и даем рекомендации по следующей замене.",
    ],
    priceFrom: 900,
    durationLabel: "20 минут",
    status: "active",
  },
  {
    title: "Предпродажная подготовка авто",
    category: "Подготовка",
    summary:
      "Поможем подготовить автомобиль к продаже: осмотр, рекомендации, список мелких доработок и фотофиксация.",
    iconPath: "/icons/services/star.svg",
    includedItems: [
      "Осмотр автомобиля перед продажей и список сильных и слабых сторон.",
      "Рекомендации по мелким доработкам, которые реально повысят ликвидность.",
      "Подсказки по подаче автомобиля и акцентам для объявления и показа.",
    ],
    workflowSteps: [
      "Сначала оцениваем текущее состояние машины и обсуждаем цель продажи.",
      "Потом формируем список доработок и приоритетов без лишних затрат.",
      "В конце объясняем, как лучше подать автомобиль и какие аргументы использовать при показе.",
    ],
    priceFrom: 5400,
    durationLabel: "4 часа",
    status: "active",
  },
  {
    title: "Сопровождение сделки купли-продажи",
    category: "Подбор",
    summary:
      "Проверим документы, поможем на этапе расчета и снизим риски при оформлении сделки.",
    iconPath: "/icons/services/identification.svg",
    includedItems: [
      "Проверка комплекта документов и ключевых рисков перед подписанием сделки.",
      "Подсказки по безопасному расчету, распискам и фиксации передачи автомобиля.",
      "Сопровождение клиента на финальном этапе оформления договоренностей.",
    ],
    workflowSteps: [
      "Сначала проверяем документы и уточняем схему расчета между сторонами.",
      "Потом сопровождаем процесс подписания и контролируем важные формулировки.",
      "В конце убеждаемся, что передача денег, документов и автомобиля прошла безопасно.",
    ],
    priceFrom: 7500,
    durationLabel: "1 день",
    status: "active",
  },
  {
    title: "Подготовка отчета для страховой",
    category: "Документы",
    summary:
      "Соберем фотофиксацию, оформим описание повреждений и подготовим комплект материалов для обращения.",
    iconPath: "/icons/services/information-circle.svg",
    includedItems: [
      "Подробная фотофиксация повреждений и состояния автомобиля для обращения.",
      "Оформление структуры отчета с описанием видимых дефектов и обстоятельств.",
      "Подготовка комплекта материалов, который удобно использовать при подаче документов.",
    ],
    workflowSteps: [
      "Сначала собираем вводные по случаю и проверяем, какие материалы уже есть у клиента.",
      "Потом фиксируем повреждения и оформляем отчет в понятной последовательности.",
      "В конце передаем готовый комплект и объясняем, что приложить при обращении дальше.",
    ],
    priceFrom: 4500,
    durationLabel: "1 день",
    status: "draft",
  },
  {
    title: "Консультация по выбору комплектации",
    category: "Консультация",
    summary:
      "Сравним комплектации, расскажем про сильные и слабые стороны и поможем выбрать оптимальный вариант.",
    iconPath: "/icons/services/information-circle.svg",
    includedItems: [
      "Сравнение доступных комплектаций под ваши задачи, бюджет и ожидания.",
      "Разбор сильных и слабых сторон конкретных опций без маркетинговой шелухи.",
      "Итоговая рекомендация по версии автомобиля, которую реально стоит искать.",
    ],
    workflowSteps: [
      "Сначала выясняем, как вы планируете использовать автомобиль и что для вас критично.",
      "Потом сравниваем комплектации, двигатели и наборы опций на практике.",
      "В конце рекомендуем оптимальную конфигурацию и объясняем, за что действительно стоит платить.",
    ],
    priceFrom: 2500,
    durationLabel: "45 минут",
    status: "draft",
  },
  {
    title: "Проверка автомобиля для автопарка",
    category: "Корпоративные услуги",
    summary:
      "Подготовим чек-лист и регламент проверки автомобиля для бизнеса, лизинга или внутреннего автопарка.",
    iconPath: "/icons/services/rectangle-stack.svg",
    includedItems: [
      "Разработка понятного чек-листа проверки автомобиля под задачи автопарка.",
      "Оценка технического состояния машины с учетом корпоративной эксплуатации.",
      "Рекомендации по регламенту осмотров, приемки и дальнейшего обслуживания.",
    ],
    workflowSteps: [
      "Сначала уточняем формат эксплуатации, требования к отчетности и объем автопарка.",
      "Потом адаптируем чек-лист и проводим пилотную проверку автомобиля по регламенту.",
      "В конце передаем структуру контроля и рекомендации по системной работе с транспортом.",
    ],
    priceFrom: 9800,
    durationLabel: "1 день",
    status: "hidden",
  },
];

const demoReviewerPassword = "review.demo";

const demoReviewFixtures = [
  {
    user: {
      email: "nikita.loginov@autocare.dev",
      username: "Никита Логинов",
      phone: "+7 (912) 345-67-81",
    },
    car: {
      licensePlate: "T210MP174",
      brand: "Toyota",
      model: "Camry",
      year: 2019,
      mileage: 86200,
      vin: "JTNB11HK203012345",
      photoUrl: null,
    },
    snapshotId: "seed-snapshot-review-1",
    order: {
      id: "seed-order-review-1",
      scheduledFor: new Date("2026-05-14T09:30:00.000Z"),
      quotedPrice: 2600,
      notes:
        "Попросил дополнительно проверить состояние масла и дать рекомендации по следующему ТО.",
      createdAt: new Date("2026-05-13T12:15:00.000Z"),
    },
    service: {
      title: "Замена моторного масла",
      category: "Техническое обслуживание",
    },
    review: {
      id: "seed-review-1",
      rating: 5,
      comment:
        "Все сделали быстро и спокойно объяснили, какое масло залили и когда лучше приехать снова. Удобный сервис без навязывания лишних работ.",
      createdAt: new Date("2026-05-14T14:20:00.000Z"),
    },
  },
  {
    user: {
      email: "elena.smirnova@autocare.dev",
      username: "Елена Смирнова",
      phone: "+7 (919) 220-11-43",
    },
    car: {
      licensePlate: "A467AA174",
      brand: "Audi",
      model: "A7",
      year: 2018,
      mileage: 65400,
      vin: "WAUZZZ4G8JN045678",
      photoUrl: null,
    },
    snapshotId: "seed-snapshot-review-2",
    order: {
      id: "seed-order-review-2",
      scheduledFor: new Date("2026-05-20T11:00:00.000Z"),
      quotedPrice: 2500,
      notes:
        "Просьба подробно объяснить найденные ошибки и понять, нужна ли срочная запись на ремонт.",
      createdAt: new Date("2026-05-19T15:40:00.000Z"),
    },
    service: {
      title: "Компьютерная диагностика",
      category: "Диагностика",
    },
    review: {
      id: "seed-review-2",
      rating: 5,
      comment:
        "Диагностику провели аккуратно, расшифровали ошибки простым языком и сразу выделили, что критично, а что можно отложить. После визита стало намного спокойнее.",
      createdAt: new Date("2026-05-20T16:35:00.000Z"),
    },
  },
  {
    user: {
      email: "artyom.volkov@autocare.dev",
      username: "Артем Волков",
      phone: "+7 (951) 777-20-20",
    },
    car: {
      licensePlate: "B456DE177",
      brand: "BMW",
      model: "X5",
      year: 2020,
      mileage: 35100,
      vin: "WBAJU61040L654321",
      photoUrl: null,
    },
    snapshotId: "seed-snapshot-review-3",
    order: {
      id: "seed-order-review-3",
      scheduledFor: new Date("2026-05-24T13:30:00.000Z"),
      quotedPrice: 4900,
      notes:
        "Нужно проверить состояние дисков и подсказать, стоит ли менять что-то еще вместе с колодками.",
      createdAt: new Date("2026-05-23T10:10:00.000Z"),
    },
    service: {
      title: "Замена тормозных колодок",
      category: "Техническое обслуживание",
    },
    review: {
      id: "seed-review-3",
      rating: 4,
      comment:
        "Работы выполнили качественно, дополнительно показали состояние дисков и дали понятные рекомендации. Снял балл только за небольшую задержку по времени.",
      createdAt: new Date("2026-05-24T18:00:00.000Z"),
    },
  },
  {
    user: {
      email: "nikita.loginov@autocare.dev",
      username: "Никита Логинов",
      phone: "+7 (912) 345-67-81",
    },
    car: {
      licensePlate: "M314OK174",
      brand: "Volkswagen",
      model: "Tiguan",
      year: 2021,
      mileage: 42800,
      vin: "WVGZZZ5NZMW123456",
      photoUrl: null,
    },
    snapshotId: "seed-snapshot-review-4",
    order: {
      id: "seed-order-review-4",
      scheduledFor: new Date("2026-05-28T10:00:00.000Z"),
      quotedPrice: 3600,
      notes:
        "Перед покупкой хотел получить честное заключение по кузову, двигателю и реальным рискам сделки.",
      createdAt: new Date("2026-05-27T18:45:00.000Z"),
    },
    service: {
      title: "Диагностика перед покупкой",
      category: "Диагностика",
    },
    review: {
      id: "seed-review-4",
      rating: 5,
      comment:
        "Очень полезная проверка перед покупкой. Показали нюансы по кузову, объяснили реальное состояние машины и помогли избежать сомнительной сделки.",
      createdAt: new Date("2026-05-28T17:10:00.000Z"),
    },
  },
];

const syncDefaultServices = async () => {
  const servicesBySlug = new Map();

  for (const serviceData of defaultServices) {
    const slug = createServiceSlug(serviceData.title, serviceData.category);

    const service = await prisma.service.upsert({
      where: {
        slug,
      },
      update: {
        ...serviceData,
        slug,
      },
      create: {
        ...serviceData,
        slug,
      },
    });

    servicesBySlug.set(slug, service);
  }

  return servicesBySlug;
};

const syncDemoReviews = async (servicesBySlug) => {
  const passwordHash = await bcrypt.hash(demoReviewerPassword, 10);

  for (const fixture of demoReviewFixtures) {
    const serviceSlug = createServiceSlug(
      fixture.service.title,
      fixture.service.category,
    );
    const service = servicesBySlug.get(serviceSlug);

    if (!service) {
      throw new Error(
        `Service for review seed is missing: ${fixture.service.title} / ${fixture.service.category}`,
      );
    }

    const user = await prisma.user.upsert({
      where: {
        email: fixture.user.email,
      },
      update: {
        username: fixture.user.username,
        phone: fixture.user.phone,
        avatarUrl: null,
        password: passwordHash,
        role: "USER",
      },
      create: {
        email: fixture.user.email,
        username: fixture.user.username,
        phone: fixture.user.phone,
        avatarUrl: null,
        password: passwordHash,
        role: "USER",
      },
    });

    const car = await prisma.car.upsert({
      where: {
        licensePlate: fixture.car.licensePlate,
      },
      update: {
        userId: user.id,
        brand: fixture.car.brand,
        model: fixture.car.model,
        year: fixture.car.year,
        mileage: fixture.car.mileage,
        vin: fixture.car.vin,
        photoUrl: fixture.car.photoUrl,
      },
      create: {
        userId: user.id,
        brand: fixture.car.brand,
        model: fixture.car.model,
        year: fixture.car.year,
        mileage: fixture.car.mileage,
        vin: fixture.car.vin,
        licensePlate: fixture.car.licensePlate,
        photoUrl: fixture.car.photoUrl,
      },
    });

    const snapshot = await prisma.carSnapshot.upsert({
      where: {
        id: fixture.snapshotId,
      },
      update: {
        sourceCarId: car.id,
        brand: fixture.car.brand,
        model: fixture.car.model,
        year: fixture.car.year,
        mileage: fixture.car.mileage,
        plateNumber: fixture.car.licensePlate,
        photoUrl: fixture.car.photoUrl,
      },
      create: {
        id: fixture.snapshotId,
        sourceCarId: car.id,
        brand: fixture.car.brand,
        model: fixture.car.model,
        year: fixture.car.year,
        mileage: fixture.car.mileage,
        plateNumber: fixture.car.licensePlate,
        photoUrl: fixture.car.photoUrl,
        createdAt: fixture.order.createdAt,
      },
    });

    const orderData = {
      userId: user.id,
      serviceId: service.id,
      carSnapshotId: snapshot.id,
      customerName: fixture.user.username,
      customerEmail: fixture.user.email,
      customerPhone: fixture.user.phone,
      serviceTitle: service.title,
      serviceCategory: service.category,
      serviceIconPath: service.iconPath,
      servicePriceFrom: service.priceFrom,
      serviceDurationLabel: service.durationLabel,
      status: "completed",
      scheduledFor: fixture.order.scheduledFor,
      quotedPrice: fixture.order.quotedPrice,
      notes: fixture.order.notes,
    };

    const order = await prisma.order.upsert({
      where: {
        id: fixture.order.id,
      },
      update: orderData,
      create: {
        id: fixture.order.id,
        ...orderData,
        createdAt: fixture.order.createdAt,
      },
    });

    await prisma.review.upsert({
      where: {
        orderId: order.id,
      },
      update: {
        userId: user.id,
        serviceId: service.id,
        rating: fixture.review.rating,
        comment: fixture.review.comment,
      },
      create: {
        id: fixture.review.id,
        userId: user.id,
        serviceId: service.id,
        orderId: order.id,
        rating: fixture.review.rating,
        comment: fixture.review.comment,
        createdAt: fixture.review.createdAt,
      },
    });
  }
};

const main = async () => {
  const servicesBySlug = await syncDefaultServices();
  await syncDemoReviews(servicesBySlug);

  const servicesCount = await prisma.service.count();
  const usersCount = await prisma.user.count({
    where: {
      email: {
        in: [...new Set(demoReviewFixtures.map((fixture) => fixture.user.email))],
      },
    },
  });
  const reviewsCount = await prisma.review.count({
    where: {
      id: {
        in: demoReviewFixtures.map((fixture) => fixture.review.id),
      },
    },
  });

  console.log(
    `Seed completed. Services: ${servicesCount}, demo reviewers: ${usersCount}, demo reviews: ${reviewsCount}`,
  );
};

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
