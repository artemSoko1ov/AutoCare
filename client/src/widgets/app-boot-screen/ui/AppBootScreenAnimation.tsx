import Icon from "@/shared/ui/Icon";
import styles from "./AppBootScreen.module.scss";

type AppBootScreenAnimationProps = {
  className?: string;
};

// Replace this component when your final boot animation is ready.
const AppBootScreenAnimation = ({ className = "" }: AppBootScreenAnimationProps) => {
  return (
    <div className={`${styles.orbit} ${className}`.trim()}>
      <span aria-hidden="true" className={styles.orbitGlow} />
      <span aria-hidden="true" className={styles.orbitRing} />
      <span aria-hidden="true" className={styles["orbitRing--secondary"]} />

      <span aria-hidden="true" className={styles.orbitDot} />
      <span aria-hidden="true" className={styles["orbitDot--secondary"]} />

      <div className={styles.orbitCore}>
        <span className={styles.orbitIcon}>
          <Icon name="wrench" />
        </span>
      </div>
    </div>
  );
};

export default AppBootScreenAnimation;
