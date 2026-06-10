# AutoCare

AutoCare — full-stack веб-приложение для сервиса подбора, диагностики и сопровождения автомобилей.  
Репозиторий организован как `pnpm`-монорепа: клиент, сервер и общие контракты живут в одном проекте и используют общую типизацию.

## Что умеет проект

- публичные страницы: главная, каталог услуг, карточка услуги, контакты, sitemap;
- регистрация и авторизация пользователей;
- профиль пользователя;
- управление автомобилями в личном кабинете;
- создание и просмотр заявок;
- отзывы по выполненным услугам;
- административная панель для управления услугами, отзывами и заявками;
- общие контракты между frontend и backend через TypeScript + Zod.

## Стек

| Слой | Технологии |
| --- | --- |
| Frontend | React 19, Vite, TypeScript, React Router, Redux Toolkit, React Query, Axios, SCSS |
| Backend | NestJS, TypeScript, Prisma, PostgreSQL, JWT, cookie-parser |
| Общий слой | `@shared/contracts`, Zod |
| Инфраструктура | pnpm workspaces, Docker Compose для локальной PostgreSQL |

## Структура репозитория

```text
.
├─ client/   # React + Vite приложение
├─ server/   # NestJS API, Prisma schema, migrations, seed, Docker Compose
├─ shared/   # общие контракты и схемы валидации
└─ README.md
```

### Ключевые директории

- `client/src/app`, `client/src/pages`, `client/src/widgets`, `client/src/features`, `client/src/entities` — клиентская архитектура по слоям.
- `server/src/modules` — доменные модули backend: `auth`, `cars`, `orders`, `profile`, `reviews`, `services`, `tokens`.
- `server/prisma` — схема БД, миграции и сиды.
- `shared/contracts` — типы и Zod-схемы для `auth`, `cars`, `services`, `orders`, `reviews`.

## Доменные сущности

- `User` — пользователь, роли `USER` и `ADMIN`.
- `Car` — автомобиль пользователя.
- `CarSnapshot` — снимок автомобиля на момент создания заявки.
- `Service` — услуга с категорией, стоимостью, блоками описания и slug.
- `Order` — заявка на услугу.
- `Review` — отзыв по выполненной заявке.
- `Token` — refresh token для сессии.

## Требования

- Node.js `20+`
- `pnpm 10+`
- Docker и Docker Compose для локальной PostgreSQL
- PostgreSQL `16`, если запускаете БД без Docker

## Переменные окружения

Для локальной разработки в проекте уже есть готовые `.env`-файлы.  
Для production используйте отдельные значения и обязательно замените секреты.

### Frontend: `client/.env`

```env
VITE_API_URL=http://localhost:7000/api
```

### Backend: `server/.env`

```env
PORT=7000
CORS_ORIGINS=http://localhost:5173

POSTGRES_DB=autocare-db
POSTGRES_USER=autocare
POSTGRES_PASSWORD=autocare
POSTGRES_PORT=5555

DATABASE_URL=postgresql://autocare:autocare@localhost:5555/autocare-db?schema=public

JWT_ACCESS_SECRET=jwt-access-secret-key
JWT_REFRESH_SECRET=jwt-refresh-secret-key

ADMIN_EMAIL=admin@admin.admin
ADMIN_PASSWORD=admin.admin
ADMIN_USERNAME=Administrator
```

## Быстрый старт

### 1. Установить зависимости

```bash
pnpm install
```

### 2. Поднять PostgreSQL

```bash
cd server
docker compose up -d
cd ..
```

### 3. Применить миграции

```bash
pnpm --dir server exec prisma migrate deploy --schema prisma/schema.prisma
```

### 4. Опционально заполнить БД стартовыми данными

```bash
pnpm --dir server exec prisma db seed --schema prisma/schema.prisma
```

### 5. Запустить проект

```bash
pnpm dev
```

После запуска:

- frontend: [http://localhost:5173](http://localhost:5173)
- backend API: [http://localhost:7000/api](http://localhost:7000/api)

## Полезные команды

### Команды монорепы

```bash
pnpm dev
pnpm build
pnpm lint
pnpm lint:fix
pnpm test
```

### Полезные команды backend

```bash
pnpm --dir server exec prisma migrate deploy --schema prisma/schema.prisma
pnpm --dir server exec prisma db seed --schema prisma/schema.prisma
pnpm --dir server start:prod
```

### Полезные команды frontend

```bash
pnpm --dir client preview
pnpm --dir client format:check
```

## Скрипты верхнего уровня

| Команда | Что делает |
| --- | --- |
| `pnpm dev` | запускает frontend и backend параллельно |
| `pnpm build` | собирает `shared`, `client` и `server` |
| `pnpm lint` | запускает ESLint/Stylelint по всему проекту |
| `pnpm lint:fix` | исправляет часть проблем автоматически |
| `pnpm test` | запускает тесты backend |

## Авторизация и сессии

- access token передается в `Authorization: Bearer ...`;
- refresh token хранится в `HttpOnly` cookie;
- frontend автоматически пытается обновить access token при `401`;
- для локальной разработки используется `VITE_API_URL=http://localhost:7000/api`.

### Администратор

Для локальной разработки администратор задается через `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_USERNAME` в `server/.env`.

Локальные значения по умолчанию:

- email: `admin@admin.admin`
- password: `admin.admin`

Важно:

- в production не используйте локальные значения;
- в production необходимо явно задать `ADMIN_EMAIL` и `ADMIN_PASSWORD`;
- fallback на дефолтного админа в production отключен.

## Production deployment

Рекомендуемая схема деплоя:

- frontend раздается как статика;
- backend работает отдельно как Node.js сервис;
- PostgreSQL живет отдельно или в Docker;
- frontend и API лучше держать на одном домене через reverse proxy.

### Почему лучше один домен

Проект использует refresh cookie и `withCredentials`, поэтому самый надежный сценарий:

- сайт: `https://example.com`
- API: `https://example.com/api`

Для production frontend удобно собирать с таким значением:

```env
VITE_API_URL=/api
```

### Минимальный сценарий деплоя

1. Установить зависимости: `pnpm install --frozen-lockfile`
2. Собрать проект: `pnpm build`
3. Применить миграции: `pnpm --dir server exec prisma migrate deploy --schema prisma/schema.prisma`
4. Запустить backend как системный сервис
5. Настроить `nginx`:
   - статика из `client/dist`
   - прокси `/api` на `server`
   - `try_files $uri /index.html` для SPA-маршрутов

## Проверка качества

Перед деплоем полезно прогонять:

```bash
pnpm lint
pnpm test
pnpm build
```

## Типичные проблемы

### Порт `7000` уже занят

Backend выведет понятную ошибку при запуске. Освободите порт или измените `PORT` в `server/.env`.

### После запуска backend не видит базу

Проверьте:

- запущен ли контейнер PostgreSQL;
- корректен ли `DATABASE_URL`;
- применены ли миграции.

### После деплоя не работает логин или refresh

Проверьте:

- `VITE_API_URL`;
- `CORS_ORIGINS`;
- HTTPS в production;
- что frontend и API находятся на одном домене или грамотно настроены под cookie-сценарий.

### Прямые переходы по URL дают `404`

Если frontend раздается через `nginx`, обязательно добавьте fallback:

```nginx
try_files $uri /index.html;
```

## Workspace packages

`pnpm-workspace.yaml` подключает три пакета:

- `client`
- `server`
- `shared`

Это позволяет использовать `@shared/contracts` одновременно в клиенте и сервере без дублирования DTO и схем.
