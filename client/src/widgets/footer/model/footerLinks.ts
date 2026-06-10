import { LEGAL_DOCS } from "@/shared/config/legalDocs";

export type FooterContactItem = {
  label: string;
  href?: string;
};

export type FooterInfoLink = {
  label: string;
  href?: string;
  to?: string;
  external?: boolean;
};

export type FooterPageLink = {
  label: string;
  to: string;
};

export const footerContactGroups: FooterContactItem[][] = [
  [
    { label: "8 (800) 000-00-00", href: "tel:+78000000000" },
    { label: "+7 (351) 000-00-00", href: "tel:+73510000000" },
    { label: "info@autocare.org", href: "mailto:info@autocare.org" },
  ],
  [{ label: "Челябинск, ул Гагарина, д. 7" }, { label: "График работы 9:00 - 21:00" }],
];

export const footerInfoLinks: FooterInfoLink[] = [
  { label: LEGAL_DOCS.consent.label, href: LEGAL_DOCS.consent.href, external: true },
  {
    label: LEGAL_DOCS.privacyPolicy.label,
    href: LEGAL_DOCS.privacyPolicy.href,
    external: true,
  },
  {
    label: LEGAL_DOCS.personalDataPolicy.label,
    href: LEGAL_DOCS.personalDataPolicy.href,
    external: true,
  },
  { label: "Карта сайта", to: "/sitemap" },
];

export const footerPageLinks: FooterPageLink[] = [
  { label: "Главная", to: "/" },
  { label: "Услуги", to: "/services" },
  { label: "Контакты", to: "/contacts" },
  { label: "Вход", to: "/login" },
  { label: "Регистрация", to: "/sign-up" },
];
