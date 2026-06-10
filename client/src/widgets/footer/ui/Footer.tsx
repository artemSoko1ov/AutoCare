import clsx from "clsx";
import { Link } from "react-router-dom";
import logoImage from "@/shared/assets/images/logo.png";
import { footerContactGroups, footerInfoLinks, footerPageLinks } from "../model/footerLinks";
import styles from "./Footer.module.scss";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={clsx("surface", "surface--glass", styles.shell)}>
          <div className={styles.main}>
            <div className={styles.brand}>
              <Link className={styles.brandLink} to="/">
                <img alt="AutoCare" className={styles.brandImage} src={logoImage} />
              </Link>
            </div>

            <div className={styles.sections}>
              <div className={clsx("flow", styles.section)}>
                <p className={styles.sectionTitle}>Контакты</p>

                <div className={clsx("flow", styles.contacts)}>
                  {footerContactGroups.map((group, index) => (
                    <div className={clsx("flow", styles.contactGroup)} key={index}>
                      {group.map((item) =>
                        item.href ? (
                          <a className={styles.contactLink} href={item.href} key={item.label}>
                            {item.label}
                          </a>
                        ) : (
                          <p className={styles.contactText} key={item.label}>
                            {item.label}
                          </p>
                        ),
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <nav aria-label="Документы и информация" className={clsx("flow", styles.section)}>
                <p className={styles.sectionTitle}>Информация</p>

                <div className={clsx("flow", styles.sectionLinks)}>
                  {footerInfoLinks.map((link) =>
                    link.to ? (
                      <Link className={styles.link} key={link.label} to={link.to}>
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        className={styles.link}
                        href={link.href}
                        key={link.label}
                        rel={link.external ? "noreferrer" : undefined}
                        target={link.external ? "_blank" : undefined}
                      >
                        {link.label}
                      </a>
                    ),
                  )}
                </div>
              </nav>

              <nav aria-label="Страницы сайта" className={clsx("flow", styles.section)}>
                <p className={styles.sectionTitle}>Страницы</p>

                <div className={clsx("flow", styles.sectionLinks)}>
                  {footerPageLinks.map((link) => (
                    <Link className={styles.link} key={link.to} to={link.to}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </nav>
            </div>
          </div>

          <div className={styles.bottom}>
            <p className={styles.bottomCopyright}>© {year} AutoCare</p>
            <p className={styles.bottomOffer}>Информация на сайте является публичной офертой.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
