import clsx from "clsx";
import Button from "@/shared/ui/Button";
import Section from "@/shared/ui/Section";
import Icon, { type IconName } from "@/shared/ui/Icon";
import BookingCta from "@/widgets/booking-cta/ui/BookingCta";
import PageBreadcrumbs from "@/widgets/page-breadcrumbs";
import styles from "./ContactsPage.module.scss";

type ContactItem = {
  id: string;
  label: string;
  value: string;
  note: string;
  icon: IconName;
  href?: string;
};

type FactItem = {
  id: string;
  title: string;
  text: string;
  icon: IconName;
};

const mapEmbedUrl =
  "https://yandex.ru/map-widget/v1/?ll=61.445167%2C55.142742&mode=search&sctx=ZAAAAAgBEAAaKAoSCcAg6dMqpE5AEYR%2Bpl63jktAEhIJdO52vTRFsD8RXdxGA3gLpD8iBgABAgMEBSgKOABAkpEHSAFqAnJ1nQHNzMw9oAEAqAEAvQHy5l4UggIQ0L7QstC%2B0YHQstGA0LLRgYoCAJICAJoCDGRlc2t0b3AtbWFwcw%3D%3D&sll=61.445167%2C55.142742&source=serp_navig&sspn=0.007101%2C0.002478&whatshere%5Bpoint%5D=61.444858%2C55.143108&whatshere%5Bzoom%5D=17&z=17.88";

const contactItems: ContactItem[] = [
  {
    id: "phone-main",
    label: "Основной телефон",
    value: "8 (800) 000-00-00",
    note: "Бесплатная линия для консультаций и записи",
    icon: "phone",
    href: "tel:+78000000000",
  },
  {
    id: "phone-city",
    label: "Городской номер",
    value: "+7 (351) 000-00-00",
    note: "Для связи с офисом и уточнения текущих заявок",
    icon: "support",
    href: "tel:+73510000000",
  },
  {
    id: "email",
    label: "Электронная почта",
    value: "info@autocare.org",
    note: "Отвечаем на письма, предложения и вопросы по сервису",
    icon: "mail",
    href: "mailto:info@autocare.org",
  },
  {
    id: "address",
    label: "Адрес",
    value: "Челябинск, ул. Гагарина, д. 7",
    note: "Принимаем клиентов ежедневно с 9:00 до 21:00",
    icon: "map-pin",
  },
];

const factItems: FactItem[] = [
  {
    id: "fact-orders",
    title: "Сопровождаем заявки",
    text: "Помогаем от первого обращения до завершения работ и выдачи автомобиля.",
    icon: "briefcase",
  },
  {
    id: "fact-time",
    title: "Удобный график",
    text: "Работаем каждый день, чтобы вам было проще подобрать удобное время визита.",
    icon: "clock",
  },
  {
    id: "fact-support",
    title: "Всегда на связи",
    text: "Подскажем по услугам, стоимости и статусу обращения без лишней бюрократии.",
    icon: "support",
  },
];

const ContactsPage = () => {
  return (
    <Section
      breadcrumbs={<PageBreadcrumbs />}
      bodyClassName={styles.content}
      className={clsx("page-shell", "page-shell--accent", styles.page)}
      description="Свяжитесь с AutoCare удобным способом, приезжайте в офис или откройте карту, чтобы быстро построить маршрут."
      title="Контакты"
      titleAs="h1"
      titleSize="h1"
    >
      <div className={styles.topGrid}>
        <article className={clsx("surface", "surface--glass", styles.card, styles.aboutCard)}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>О компании</h2>
            <p className={styles.cardText}>
              AutoCare помогает владельцам автомобилей быстрее решать вопросы с обслуживанием,
              диагностикой и сопровождением заявок. Мы делаем сервис понятным: объясняем этапы
              работ, держим клиента в курсе статуса и всегда оставляем удобный канал связи.
            </p>
          </div>

          <div className={styles.factList}>
            {factItems.map((fact) => (
              <div className={styles.factItem} key={fact.id}>
                <span className={styles.factIcon}>
                  <Icon name={fact.icon} />
                </span>
                <div className={styles.factBody}>
                  <h3 className={styles.factTitle}>{fact.title}</h3>
                  <p className={styles.factText}>{fact.text}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className={clsx("surface", "surface--glass", styles.card, styles.mapCard)}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Где мы находимся</h2>
            <p className={styles.cardText}>
              Офис AutoCare расположен в Челябинске на улице Гагарина, д. 7. На карте ниже можно
              посмотреть точку и быстро открыть маршрут.
            </p>
          </div>

          <div className={styles.mapFrame}>
            <iframe
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={mapEmbedUrl}
              title="Карта с адресом AutoCare"
            />
          </div>
        </article>
      </div>

      <div className={styles.contactGrid}>
        {contactItems.map((item) => {
          const ContentTag = item.href ? "a" : "div";

          return (
            <article
              className={clsx("surface", "surface--glass", styles.contactCard)}
              key={item.id}
            >
              <span className={styles.contactIcon}>
                <Icon name={item.icon} />
              </span>

              <div className={styles.contactBody}>
                <span className={styles.contactLabel}>{item.label}</span>
                <ContentTag
                  {...(item.href ? { href: item.href } : {})}
                  className={styles.contactValue}
                >
                  {item.value}
                </ContentTag>
                <p className={styles.contactNote}>{item.note}</p>
              </div>
            </article>
          );
        })}
      </div>

      <BookingCta
        action={
          <Button
            leftIcon={<Icon name="phone" />}
            onClick={() => {
              window.location.href = "tel:+78000000000";
            }}
            size="lg"
          >
            Позвонить сейчас
          </Button>
        }
        description="Свяжемся без долгих ожиданий, уточним задачу, подскажем по ближайшему времени и поможем выбрать удобный формат обращения."
        icon={<Icon name="support" />}
        title="Нужно быстро обсудить диагностику или запись в сервис?"
      />
    </Section>
  );
};

export default ContactsPage;
