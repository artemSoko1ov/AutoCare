import clsx from "clsx";
import type { ProfileFavoriteServiceItem } from "@/entities/profile/model";
import Icon from "@/shared/ui/Icon";
import styles from "./ProfileFavorites.module.scss";

type ProfileFavoritesProps = {
  section: {
    title: string;
    actionLabel: string;
    items: ProfileFavoriteServiceItem[];
  };
};

const ProfileFavorites = ({ section }: ProfileFavoritesProps) => {
  return (
    <div className={clsx("surface", "surface--glass", styles.card)}>
      <div className={styles.header}>
        <h2 className={styles.title}>{section.title}</h2>
        <button className={styles.link} type="button">
          {section.actionLabel}
        </button>
      </div>

      <div className={styles.list}>
        {section.items.map((item) => (
          <div className={styles.item} key={item.id}>
            <div className={styles.itemMain}>
              <span className={styles.heart}>
                <Icon name="heart" />
              </span>
              <span className={styles.itemTitle}>{item.title}</span>
            </div>
            <span className={styles.price}>{item.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileFavorites;
