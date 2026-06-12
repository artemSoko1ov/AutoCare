# AutoCare

AutoCare — full-stack веб-приложение для автосервиса. Проект объединяет публичный сайт, личный кабинет клиента и административную панель в одном монорепозитории.

## О проекте

Внутри проекта есть:

- каталог услуг;
- регистрация и авторизация;
- профиль клиента;
- управление автомобилями;
- создание и отслеживание заявок;
- отзывы;
- админ-панель для управления услугами, отзывами и заявками.

## Стек

- `client` — React 19, Vite, TypeScript, Redux Toolkit, TanStack Query, SCSS;
- `server` — NestJS, Prisma, PostgreSQL;
- `shared` — общие контракты, типы и схемы валидации.

## Быстрый запуск

### 1. Установить зависимости

Из корня проекта:

```bash
pnpm install
```

### 2. Проверить переменные окружения

Сервер использует файл [server/.env](D:/Project/AutoCare/server/.env).

Основные переменные:

```env
PORT=7000
CORS_ORIGINS=http://localhost:5173
DATABASE_URL="postgresql://autocare:autocare@localhost:5555/autocare-db?schema=public"
JWT_ACCESS_SECRET="jwt-access-secret-key"
JWT_REFRESH_SECRET="jwt-refresh-secret-key"
ADMIN_EMAIL='admin@admin.admin'
ADMIN_PASSWORD='admin.admin'
ADMIN_USERNAME='Administrator'
```

Клиент использует:

- [client/.env](D:/Project/AutoCare/client/.env) для разработки;
- [client/.env.production](D:/Project/AutoCare/client/.env.production) для production-сборки.

Текущие значения:

```env
# client/.env
VITE_API_URL=http://localhost:7000/api

# client/.env.production
VITE_API_URL=/api
```

### 3. Запустить проект в режиме разработки

Одна команда из корня:

```bash
pnpm dev
```

После запуска будут доступны:

- frontend: `http://localhost:5173`
- backend: `http://localhost:7000`
- API: `http://localhost:7000/api`

### 4. Запустить production preview локально

Собрать и сразу запустить preview:

```bash
pnpm preview
```

Если сборка уже сделана и нужен только запуск:

```bash
pnpm preview:start
```

В этом режиме:

- frontend: `http://localhost:4173`
- backend: `http://localhost:7000`

## Сборка

Собрать весь проект из корня:

```bash
pnpm build
```

## Полезные команды

Проверка перед деплоем:

```bash
pnpm deploy:check
```

Деплой с миграциями:

```bash
pnpm deploy:prod
```

Деплой с миграциями и сидированием:

```bash
pnpm deploy:prod:seed
```

Линтеры:

```bash
pnpm lint
```

Тесты сервера:

```bash
pnpm test
```

## Структура

- `client` — frontend;
- `server` — backend API;
- `shared` — общие типы и контракты;
- `scripts` — служебные скрипты для сборки и деплоя.

## Идея проекта

AutoCare — это единая цифровая среда для автосервиса: клиент может выбрать услугу, записаться, вести свои автомобили и следить за заявками, а команда сервиса получает рабочие инструменты для управления контентом и операционными процессами.
