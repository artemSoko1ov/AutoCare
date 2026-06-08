import clsx from "clsx";
import { NavLink } from "react-router-dom";
import { useLogout } from "@/features/auth/logout";
import type { ProfileSidebarItem } from "@/entities/profile/model";
import Icon from "@/shared/ui/Icon";
import styles from "./ProfileSidebar.module.scss";

type ProfileSidebarProps = {
  items: ProfileSidebarItem[];
};

const ProfileSidebar = ({ items }: ProfileSidebarProps) => {
  const { executeLogout, loading } = useLogout();

  return (
    <aside className={clsx("surface", "surface--glass", styles.sidebar)}>
      <nav aria-label="Навигация профиля" className={styles.nav}>
        {items.map((item) =>
          item.to ? (
            <NavLink
              className={({ isActive }) =>
                clsx(styles.item, {
                  [styles["item--active"]]: isActive,
                })
              }
              end={item.to === "/profile"}
              key={item.id}
              to={item.to}
            >
              <span className={styles.icon}>
                <Icon name={item.icon} />
              </span>
              <span>{item.label}</span>
            </NavLink>
          ) : (
            <div className={styles.item} key={item.id}>
              <span className={styles.icon}>
                <Icon name={item.icon} />
              </span>
              <span>{item.label}</span>
            </div>
          ),
        )}

        <button
          className={clsx(styles.item, styles["item--danger"])}
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

export default ProfileSidebar;
