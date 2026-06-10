import clsx from "clsx";
import { Link } from "react-router-dom";
import { homeProcessSteps, homeProcessSupportItems } from "@/entities/home/model";
import Icon from "@/shared/ui/Icon";
import Section from "@/shared/ui/Section";
import styles from "./HomeProcess.module.scss";

const HomeProcess = () => {
  return (
    <Section
      actions={
        <Link className={styles.headerLink} to="/services">
          Смотреть услуги
          <span className={styles.headerLinkIcon}>
            <Icon name="chevron-right" />
          </span>
        </Link>
      }
      bodyClassName={styles.content}
      className={styles.section}
      description="Сервис построен так, чтобы путь от выбора услуги до результата был коротким, прозрачным и понятным для владельца автомобиля."
      title="Как работает AutoCare"
      titleAs="h2"
      titleSize="h2"
    >
      <div className={styles.layout}>
        <div className={styles.steps}>
          {homeProcessSteps.map((step) => (
            <article className={clsx("surface", "surface--glass", styles.stepCard)} key={step.id}>
              <div className={styles.stepHeader}>
                <span className={styles.stepPill}>{step.stepLabel}</span>
                <span className={styles.stepIcon}>
                  <Icon name={step.icon} />
                </span>
              </div>

              <div className={styles.stepBody}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepText}>{step.text}</p>
              </div>

              <div className={styles.stepFooter}>{step.detail}</div>
            </article>
          ))}
        </div>

        <aside className={clsx("surface", "surface--glass", styles.summaryCard)}>
          <div className={styles.summaryHeader}>
            <span className={styles.summaryEyebrow}>Что получает клиент</span>
            <h3 className={styles.summaryTitle}>
              Один аккуратный сценарий вместо заметок и переписок
            </h3>
            <p className={styles.summaryText}>
              Мы собираем ключевые действия в одну последовательность: выбор услуги, оформление
              заявки, историю по автомобилю и итоговые рекомендации после обращения.
            </p>
          </div>

          <div className={styles.summaryList}>
            {homeProcessSupportItems.map((item) => (
              <div className={styles.summaryItem} key={item.id}>
                <span className={styles.summaryItemIcon}>
                  <Icon name={item.icon} />
                </span>
                <div className={styles.summaryItemBody}>
                  <span className={styles.summaryItemTitle}>{item.title}</span>
                  <span className={styles.summaryItemText}>{item.text}</span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.summaryActions}>
            <Link className={styles.primaryLink} to="/sign-up">
              Создать аккаунт
            </Link>

            <Link className={styles.secondaryLink} to="/contacts">
              Связаться с нами
            </Link>
          </div>
        </aside>
      </div>
    </Section>
  );
};

export default HomeProcess;
