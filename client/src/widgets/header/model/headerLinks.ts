export type HeaderLink = {
  label: string;
  to: string;
  visibility: "always" | "guest" | "auth" | "admin";
};

export const headerLinks: HeaderLink[] = [
  { label: "Главная", to: "/", visibility: "always" },
  { label: "Услуги", to: "/services", visibility: "always" },
  { label: "Контакты", to: "/contacts", visibility: "always" },
  { label: "Профиль", to: "/profile", visibility: "auth" },
  { label: "Админ панель", to: "/admin", visibility: "admin" },
  { label: "Вход", to: "/login", visibility: "guest" },
  { label: "Регистрация", to: "/sign-up", visibility: "guest" },
];
