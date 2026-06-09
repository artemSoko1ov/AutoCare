import clsx from "clsx";
import { NavLink } from "react-router-dom";
import { homeHeroContent } from "@/entities/home/model";
import heroIllustration from "@/shared/assets/images/hero-illustration.jpg";
import Icon from "@/shared/ui/Icon";
import styles from "./HomeHero.module.scss";

const HomeHero = () => {
  const { description, eyebrow, features, primaryAction, secondaryAction, title } = homeHeroContent;

  return (
    <section className={clsx("page-shell", "page-shell--accent", styles.hero)}>
      <div className="container">
        <div className={styles.shell}>
          <div className={styles.content}>
            <div className={clsx("pill", styles.eyebrow)}>
              <span className={styles.eyebrowIcon}>
                <Icon name="star" />
              </span>
              <span>{eyebrow}</span>
            </div>

            <div className={styles.copy}>
              <h1 className={styles.title}>
                <span>{title.primary}</span>
                <span>
                  {title.secondary} <span className={styles.titleAccent}>{title.accent}</span>
                </span>
              </h1>

              <p className={styles.description}>{description}</p>
            </div>

            <div className={styles.actions}>
              <NavLink
                className={clsx(styles.action, styles["action--primary"])}
                to={primaryAction.to}
              >
                <span className={styles.actionIcon}>
                  <Icon name={primaryAction.icon} />
                </span>
                <span>{primaryAction.label}</span>
                <span className={styles.actionIcon}>
                  <Icon name="chevron-right" />
                </span>
              </NavLink>

              <NavLink
                className={clsx(styles.action, styles["action--secondary"])}
                to={secondaryAction.to}
              >
                <span className={styles.actionIcon}>
                  <Icon name={secondaryAction.icon} />
                </span>
                <span>{secondaryAction.label}</span>
              </NavLink>
            </div>

            <div className={styles.features}>
              {features.map((feature) => (
                <div className={styles.feature} key={feature.id}>
                  <span className={styles.featureIcon}>
                    <Icon name={feature.icon} />
                  </span>
                  <div className={styles.featureBody}>
                    <span className={styles.featureTitle}>{feature.title}</span>
                    <span className={styles.featureDescription}>{feature.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.media}>
            <div className={styles.mediaOrbit} />
            <div className={clsx(styles.mediaOrbit, styles["mediaOrbit--middle"])} />
            <div className={clsx(styles.mediaOrbit, styles["mediaOrbit--inner"])} />
            <div className={styles.mediaDots} />

            <div className={styles.mediaFrame}>
              <img
                alt="Иллюстрация сервиса AutoCare с автомобилем и карточками возможностей"
                className={styles.image}
                src={heroIllustration}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
