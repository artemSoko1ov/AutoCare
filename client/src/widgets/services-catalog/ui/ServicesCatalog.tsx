import type { ServiceDto } from "@shared/contracts/services";
import clsx from "clsx";
import { formatServicePrice } from "@/entities/service";
import Empty from "@/shared/ui/Empty";
import Icon from "@/shared/ui/Icon";
import styles from "./ServicesCatalog.module.scss";

type ServicesCatalogProps = {
  services: ServiceDto[];
};

const ServicesCatalog = ({ services }: ServicesCatalogProps) => {
  if (services.length === 0) {
    return (
      <div className={clsx("surface", "surface--glass", styles.emptyWrap)}>
        <Empty
          description="Мы уже готовим каталог. Скоро здесь появятся активные предложения сервиса."
          icon="wrench"
          title="Услуги скоро появятся"
        />
      </div>
    );
  }

  const categoriesCount = new Set(services.map((service) => service.category)).size;
  const minPrice = services.reduce(
    (currentMinPrice, service) => Math.min(currentMinPrice, service.priceFrom),
    services[0]?.priceFrom ?? 0,
  );

  return (
    <div className={styles.section}>
      <div className={styles.highlights}>
        <article className={clsx("surface", "surface--glass", styles.highlightCard)}>
          <span className={styles.highlightIcon}>
            <Icon name="wrench" />
          </span>
          <div className={styles.highlightBody}>
            <span className={styles.highlightValue}>{services.length}</span>
            <span className={styles.highlightLabel}>Доступных услуг</span>
            <p className={styles.highlightText}>Показываем только активные предложения сервиса.</p>
          </div>
        </article>

        <article className={clsx("surface", "surface--glass", styles.highlightCard)}>
          <span className={styles.highlightIcon}>
            <Icon name="briefcase" />
          </span>
          <div className={styles.highlightBody}>
            <span className={styles.highlightValue}>{categoriesCount}</span>
            <span className={styles.highlightLabel}>Категории обслуживания</span>
            <p className={styles.highlightText}>
              От диагностики и консультаций до комплексных работ.
            </p>
          </div>
        </article>

        <article className={clsx("surface", "surface--glass", styles.highlightCard)}>
          <span className={styles.highlightIcon}>
            <Icon name="check-circle" />
          </span>
          <div className={styles.highlightBody}>
            <span className={styles.highlightValue}>{formatServicePrice(minPrice)}</span>
            <span className={styles.highlightLabel}>Стартовая стоимость</span>
            <p className={styles.highlightText}>
              Поможем подобрать удобный формат и согласовать детали визита.
            </p>
          </div>
        </article>
      </div>

      <div className={styles.grid}>
        {services.map((service) => (
          <article className={clsx("surface", "surface--glass", styles.card)} key={service.id}>
            <div className={styles.cardHeader}>
              <span className={styles.category}>{service.category}</span>
              <span className={styles.duration}>{service.durationLabel}</span>
            </div>

            <div className={styles.cardBody}>
              <h2 className={styles.title}>{service.title}</h2>
              <p className={styles.summary}>{service.summary}</p>
            </div>

            <div className={styles.cardFooter}>
              <div className={styles.priceGroup}>
                <span className={styles.priceCaption}>Стоимость</span>
                <strong className={styles.priceValue}>
                  {formatServicePrice(service.priceFrom)}
                </strong>
              </div>

              <div className={styles.meta}>
                <span className={styles.metaIcon}>
                  <Icon name="clock" />
                </span>
                <span className={styles.metaText}>Согласуем удобное время и формат обращения.</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ServicesCatalog;
