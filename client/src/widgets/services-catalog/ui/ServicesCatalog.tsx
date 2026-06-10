import type { ServiceDto } from "@shared/contracts/services";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { formatServicePrice, ServiceIcon } from "@/entities/service";
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

  return (
    <div className={styles.section}>
      <div className={styles.grid}>
        {services.map((service) => (
          <Link
            className={clsx("surface", "surface--glass", styles.card)}
            key={service.id}
            to={`/services/${service.id}`}
          >
            <div className={styles.cardHeader}>
              <ServiceIcon className={styles.serviceIcon} src={service.iconPath} />

              <div className={styles.cardMeta}>
                <span className={styles.category}>{service.category}</span>
                <span className={styles.duration}>{service.durationLabel}</span>
              </div>
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

              <div className={styles.actions}>
                <span className={styles.detailsLink}>
                  Подробнее
                  <span className={styles.detailsLinkIcon}>
                    <Icon name="chevron-right" />
                  </span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ServicesCatalog;
