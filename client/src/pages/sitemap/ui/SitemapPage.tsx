import clsx from "clsx";
import { Link } from "react-router-dom";
import type { IconName } from "@/shared/ui/Icon";
import Icon from "@/shared/ui/Icon";
import Section from "@/shared/ui/Section";
import PageBreadcrumbs from "@/widgets/page-breadcrumbs";
import styles from "./SitemapPage.module.scss";

type IntroItem = {
  id: string;
  icon: IconName;
  title: string;
  text: string;
};

type SitemapLinkItem = {
  id: string;
  title: string;
  description: string;
  to?: string;
  href?: string;
  badge?: string;
  disabled?: boolean;
};

type SitemapSection = {
  id: string;
  icon: IconName;
  title: string;
  description: string;
  links: SitemapLinkItem[];
};

const introItems: IntroItem[] = [
  {
    id: "services",
    icon: "wrench",
    title: "Быстрый доступ к разделам",
    text: "Здесь собраны все основные страницы сервиса, чтобы быстро перейти к нужному разделу.",
  },
  {
    id: "profile",
    icon: "user",
    title: "Понятная структура кабинета",
    text: "Отдельно вынесены профиль, автомобили, заявки и отзывы пользователя.",
  },
  {
    id: "support",
    icon: "support",
    title: "Удобная навигация и помощь",
    text: "Если нужная страница не находится, можно сразу перейти в контакты и связаться с AutoCare.",
  },
];

const sitemapSections: SitemapSection[] = [
  {
    id: "main",
    icon: "briefcase",
    title: "Основные страницы",
    description: "Главные публичные разделы сайта, доступные без авторизации.",
    links: [
      {
        id: "home",
        title: "Главная",
        description: "Стартовая страница с hero-секцией, подборкой услуг и CTA-блоками.",
        to: "/",
      },
      {
        id: "services",
        title: "Услуги",
        description: "Каталог всех услуг AutoCare с фильтрацией и переходом в подробности.",
        to: "/services",
      },
      {
        id: "contacts",
        title: "Контакты",
        description: "Адрес, карта, телефоны и краткая информация о компании.",
        to: "/contacts",
      },
      {
        id: "sitemap",
        title: "Карта сайта",
        description: "Страница с текущей структурой проекта и быстрыми ссылками на разделы.",
        to: "/sitemap",
      },
    ],
  },
  {
    id: "auth",
    icon: "shield",
    title: "Авторизация и аккаунт",
    description: "Страницы входа и регистрации, через которые начинается работа с кабинетом.",
    links: [
      {
        id: "login",
        title: "Вход",
        description: "Авторизация пользователя и переход в профиль или админ-панель.",
        to: "/login",
      },
      {
        id: "signup",
        title: "Регистрация",
        description: "Создание нового аккаунта с email, телефоном и персональными данными.",
        to: "/sign-up",
      },
      {
        id: "profile",
        title: "Профиль",
        description: "Обзор аккаунта, статистика и быстрый доступ к пользовательским разделам.",
        to: "/profile",
        badge: "Требует вход",
      },
    ],
  },
  {
    id: "cabinet",
    icon: "briefcase",
    title: "Личный кабинет",
    description: "Основные рабочие разделы пользователя после входа в систему.",
    links: [
      {
        id: "cars",
        title: "Мои автомобили",
        description: "Гараж пользователя с добавлением, редактированием и удалением машин.",
        to: "/profile/cars",
        badge: "Требует вход",
      },
      {
        id: "requests",
        title: "Мои заявки",
        description: "История обращений, статусы и переход в подробности по каждой заявке.",
        to: "/profile/requests",
        badge: "Требует вход",
      },
      {
        id: "reviews",
        title: "Мои отзывы",
        description: "Просмотр и управление отзывами, которые пользователь оставил по услугам.",
        to: "/profile/reviews",
        badge: "Требует вход",
      },
      {
        id: "new-request",
        title: "Новая заявка",
        description: "Оформление заявки на выбранную услугу с выбором автомобиля и времени.",
        to: "/requests/new",
        badge: "Требует вход",
      },
    ],
  },
  {
    id: "docs",
    icon: "mail",
    title: "Информация и документы",
    description: "Информационные страницы и юридические материалы, которые можно развивать дальше.",
    links: [
      {
        id: "personal-data",
        title: "Согласие на обработку персональных данных",
        description: "Раздел можно вынести в отдельную страницу с полным текстом согласия.",
        href: "#",
        disabled: true,
      },
      {
        id: "privacy-policy",
        title: "Политика конфиденциальности",
        description: "Подробные правила хранения и обработки персональных данных клиентов.",
        href: "#",
        disabled: true,
      },
      {
        id: "user-agreement",
        title: "Пользовательское соглашение",
        description: "Условия использования сайта и личного кабинета сервиса AutoCare.",
        href: "#",
        disabled: true,
      },
      {
        id: "company-details",
        title: "Реквизиты компании",
        description: "Блок с юридической информацией и реквизитами можно подключить отдельно.",
        href: "#",
        disabled: true,
      },
    ],
  },
];

const SitemapPage = () => {
  return (
    <Section
      breadcrumbs={<PageBreadcrumbs />}
      bodyClassName={styles.content}
      className={clsx("page-shell", "page-shell--accent", styles.page)}
      description="Собрали основные разделы AutoCare в одном месте, чтобы быстрее находить нужные страницы и понимать структуру сайта."
      title="Карта сайта"
      titleAs="h1"
      titleSize="h1"
    >
      <div className={styles.intro}>
        <article className={clsx("surface", "surface--glass", styles.introCard)}>
          <div className={styles.eyebrow}>
            <Icon name="briefcase" />
            Навигация по AutoCare
          </div>

          <h2 className={styles.introTitle}>Все важные разделы сайта на одной странице</h2>

          <p className={styles.introText}>
            Карта сайта помогает быстро перейти в нужный раздел, проверить, какие страницы уже
            доступны пользователю, и увидеть, какие информационные документы пока остаются
            заглушками.
          </p>

          <ul className={styles.introList}>
            {introItems.map((item) => (
              <li className={styles.introListItem} key={item.id}>
                <span className={styles.introListIcon}>
                  <Icon name={item.icon} />
                </span>
                <div className={styles.introListBody}>
                  <span className={styles.introListTitle}>{item.title}</span>
                  <span className={styles.introListText}>{item.text}</span>
                </div>
              </li>
            ))}
          </ul>
        </article>

        <aside className={clsx("surface", "surface--glass", styles.supportCard)}>
          <div className={styles.supportHeader}>
            <h2 className={styles.supportTitle}>Нужна помощь с навигацией?</h2>
            <p className={styles.supportText}>
              Если не получается найти нужный раздел или хочется быстро связаться с сервисом,
              используйте контакты ниже.
            </p>
          </div>

          <div className={styles.supportContacts}>
            <a className={styles.supportLink} href="tel:+78000000000">
              <Icon name="phone" />8 (800) 000-00-00
            </a>
            <a className={styles.supportLink} href="mailto:info@autocare.org">
              <Icon name="mail" />
              info@autocare.org
            </a>
            <span className={styles.supportMeta}>
              Челябинск, ул. Гагарина, д. 7 • ежедневно с 9:00 до 21:00
            </span>
          </div>
        </aside>
      </div>

      <div className={styles.grid}>
        {sitemapSections.map((section) => (
          <article
            className={clsx("surface", "surface--glass", styles.sectionCard)}
            key={section.id}
          >
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <Icon name={section.icon} />
                {section.title}
              </h2>
              <p className={styles.sectionText}>{section.description}</p>
            </div>

            <div className={styles.linkList}>
              {section.links.map((link) => {
                const badgeClassName = clsx(styles.badge, {
                  [styles.badgeMuted]: link.disabled,
                });

                return (
                  <div className={styles.linkItem} key={link.id}>
                    <div className={styles.linkBody}>
                      {link.to ? (
                        <Link className={styles.linkTitle} to={link.to}>
                          {link.title}
                        </Link>
                      ) : link.href ? (
                        <a
                          className={styles.linkTitle}
                          href={link.href}
                          onClick={link.disabled ? (event) => event.preventDefault() : undefined}
                        >
                          {link.title}
                        </a>
                      ) : (
                        <span className={styles.linkTitle}>{link.title}</span>
                      )}

                      <span className={styles.linkDescription}>{link.description}</span>
                    </div>

                    {link.badge ? <span className={badgeClassName}>{link.badge}</span> : null}
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
};

export default SitemapPage;
