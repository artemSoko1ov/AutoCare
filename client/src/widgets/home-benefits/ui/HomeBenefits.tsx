import clsx from "clsx";
import { Link } from "react-router-dom";
import { homeBenefitItems, homeBenefitMetrics } from "@/entities/home/model";
import Icon from "@/shared/ui/Icon";
import Section from "@/shared/ui/Section";
import styles from "./HomeBenefits.module.scss";

const HomeBenefits = () => {
  return (
    <Section
      actions={
        <Link className={styles.headerLink} to="/profile">
          Личный кабинет
          <span className={styles.headerLinkIcon}>
            <Icon name="chevron-right" />
          </span>
        </Link>
      }
      bodyClassName={styles.content}
      className={styles.section}
      description="Мы собираем полезные функции в одном интерфейсе, чтобы автомобильное обслуживание было не набором случайных действий, а понятным процессом."
      title="Почему с AutoCare спокойнее"
      titleAs="h2"
      titleSize="h2"
    >
      <div className={styles.layout}>
        <article className={clsx("surface", "surface--glass", styles.metricsCard)}>
          <div className={styles.metricsHeader}>
            <span className={styles.metricsEyebrow}>Платформа для владельца автомобиля</span>
            <h3 className={styles.metricsTitle}>
              Не просто заявка, а полный рабочий кабинет по машине
            </h3>
            <p className={styles.metricsText}>
              Здесь можно хранить автомобили, смотреть статусы обращений, возвращаться к отзывам и
              быстрее записываться на новые услуги без повторного заполнения одних и тех же данных.
            </p>
          </div>

          <div className={styles.metricsGrid}>
            {homeBenefitMetrics.map((metric) => (
              <div className={styles.metricItem} key={metric.id}>
                <div className={styles.metricHead}>
                  <span className={styles.metricIcon}>
                    <Icon name={metric.icon} />
                  </span>
                  <span className={styles.metricValue}>{metric.value}</span>
                </div>
                <span className={styles.metricLabel}>{metric.label}</span>
                <span className={styles.metricNote}>{metric.note}</span>
              </div>
            ))}
          </div>
        </article>

        <div className={styles.benefitsGrid}>
          {homeBenefitItems.map((item) => (
            <article
              className={clsx("surface", "surface--glass", styles.benefitCard)}
              key={item.id}
            >
              <span className={styles.benefitIcon}>
                <Icon name={item.icon} />
              </span>

              <div className={styles.benefitBody}>
                <h3 className={styles.benefitTitle}>{item.title}</h3>
                <p className={styles.benefitText}>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default HomeBenefits;
