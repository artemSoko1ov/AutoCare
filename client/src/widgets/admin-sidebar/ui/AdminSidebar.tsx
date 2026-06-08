import clsx from "clsx";
import { NavLink } from "react-router-dom";
import { useLogout } from "@/features/auth/logout";
import { adminSidebarLinks } from "@/entities/admin/model";
import Icon from "@/shared/ui/Icon";
import styles from "./AdminSidebar.module.scss";

const AdminSidebar = () => {
  const { executeLogout, loading } = useLogout();

  return (
    <aside className={clsx("surface", "surface--glass", styles.sidebar)}>
      <div className={styles.header}>
        <h2 className={styles.title}>Разделы</h2>
      </div>

      <nav aria-label="Навигация админки" className={styles.nav}>
        {adminSidebarLinks.map((link) => (
          <NavLink
            className={({ isActive }) =>
              clsx(styles.link, {
                [styles["link--active"]]: isActive,
              })
            }
            key={link.id}
            to={link.to}
          >
            <span className={styles.icon}>
              <Icon name={link.icon} />
            </span>
            <span>{link.label}</span>
          </NavLink>
        ))}

        <button
          className={clsx(styles.action, styles["action--danger"])}
          disabled={loading}
          onClick={() => {
            void executeLogout();
          }}
          type="button"
        >
          <span className={styles.icon}>
            <Icon name="logout" />
          </span>
          <span>{loading ? "Выходим..." : "Выйти"}</span>
        </button>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
