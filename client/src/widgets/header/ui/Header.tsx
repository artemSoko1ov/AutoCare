import { useEffect, useId, useState } from "react";
import clsx from "clsx";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "@app/providers/store/hooks.ts";
import logoImage from "@/shared/assets/images/logo.png";
import LogoutButton from "@/features/auth/logout";
import { headerLinks } from "../model/headerLinks";
import styles from "./Header.module.scss";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuth } = useAppSelector((state) => state.session);
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const mobileMenuId = useId();
  const isAdmin = currentUser?.role === "ADMIN";

  const visibleLinks = headerLinks.filter(
    (link) =>
      link.visibility === "always" ||
      (link.visibility === "auth" && isAuth) ||
      (link.visibility === "guest" && !isAuth) ||
      (link.visibility === "admin" && isAdmin),
  );
  const navigationLinks = visibleLinks.filter((link) => link.visibility !== "guest");
  const guestLinks = visibleLinks.filter((link) => link.visibility === "guest");
  const hasMobileMenuActions = isAuth || guestLinks.length > 0;

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("is-lock", isMenuOpen);

    return () => {
      root.classList.remove("is-lock");
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handleDesktop = (event: MediaQueryListEvent | MediaQueryList) => {
      if (event.matches) {
        setIsMenuOpen(false);
      }
    };

    handleDesktop(mediaQuery);

    const listener = (event: MediaQueryListEvent) => {
      handleDesktop(event);
    };

    mediaQuery.addEventListener("change", listener);

    return () => {
      mediaQuery.removeEventListener("change", listener);
    };
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <header className={styles.header}>
      <div className="container">
        <div
          className={clsx("surface", "surface--glass", styles.shell, {
            [styles["shell--menu-open"]]: isMenuOpen,
          })}
        >
          <div className={styles.topBar}>
            <NavLink className={styles.brand} onClick={closeMenu} to="/">
              <img alt="AutoCare" className={styles.brandImage} src={logoImage} />
            </NavLink>

            <nav aria-label="Основная навигация" className={styles.navDesktop}>
              <div className={clsx("cluster", styles.navList)}>
                {navigationLinks.map((link) => (
                  <NavLink
                    className={({ isActive }) =>
                      clsx(styles.link, {
                        [styles["link--active"]]: isActive,
                      })
                    }
                    end={link.to === "/"}
                    key={link.to}
                    to={link.to}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </nav>

            <div className={clsx("actions-row", styles.actionsDesktop)}>
              {!isAuth &&
                guestLinks.map((link) => (
                  <NavLink
                    className={clsx(styles.actionLink, {
                      [styles["actionLink--primary"]]: link.to === "/sign-up",
                      [styles["actionLink--secondary"]]: link.to !== "/sign-up",
                    })}
                    key={link.to}
                    to={link.to}
                  >
                    {link.label}
                  </NavLink>
                ))}

              {isAuth && (
                <LogoutButton className={styles.logoutButton} size="sm" variant="secondary" />
              )}
            </div>

            <button
              aria-controls={mobileMenuId}
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
              className={clsx(styles.burger, {
                [styles["burger--active"]]: isMenuOpen,
              })}
              onClick={toggleMenu}
              type="button"
            >
              <span className={styles.burgerLine} />
              <span className={styles.burgerLine} />
              <span className={styles.burgerLine} />
            </button>
          </div>

          <div
            className={clsx("flow", styles.mobilePanel, {
              [styles["mobilePanel--open"]]: isMenuOpen,
            })}
            id={mobileMenuId}
          >
            <nav aria-label="Мобильная навигация" className={styles.navMobile}>
              <div className={clsx("flow", styles.mobileNavList)}>
                {navigationLinks.map((link) => (
                  <NavLink
                    className={({ isActive }) =>
                      clsx(styles.mobileLink, {
                        [styles["mobileLink--active"]]: isActive,
                      })
                    }
                    end={link.to === "/"}
                    key={link.to}
                    onClick={closeMenu}
                    to={link.to}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </nav>

            {hasMobileMenuActions && (
              <div className={clsx("flow", styles.mobileMenuActions)}>
                {!isAuth &&
                  guestLinks.map((link) => (
                    <NavLink
                      className={clsx(styles.actionLink, styles.mobileMenuActionLink, {
                        [styles["actionLink--primary"]]: link.to === "/sign-up",
                        [styles["actionLink--secondary"]]: link.to !== "/sign-up",
                      })}
                      key={link.to}
                      onClick={closeMenu}
                      to={link.to}
                    >
                      {link.label}
                    </NavLink>
                  ))}

                {isAuth && (
                  <LogoutButton
                    className={styles.mobileMenuLogoutButton}
                    fullWidth
                    onClick={closeMenu}
                    size="md"
                    variant="secondary"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
