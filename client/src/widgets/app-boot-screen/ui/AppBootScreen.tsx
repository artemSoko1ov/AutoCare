import logoImage from "@/shared/assets/images/logo.png";
import AppBootScreenAnimation from "./AppBootScreenAnimation";
import styles from "./AppBootScreen.module.scss";

const AppBootScreen = () => {
  return (
    <div aria-live="polite" className={styles.screen} role="status">
      <span aria-hidden="true" className={styles["ambient--top"]} />
      <span aria-hidden="true" className={styles["ambient--right"]} />
      <span aria-hidden="true" className={styles["ambient--bottom"]} />

      <div className={styles.card}>
        <div className={styles.brand}>
          <img alt="AutoCare" className={styles.brandLogo} src={logoImage} />
        </div>

        <div className={styles.animation}>
          <AppBootScreenAnimation />
        </div>

        <div className={styles.copy}>
          <span className={styles.eyebrow}>Запуск платформы</span>
          <h1 className={styles.title}>Подготавливаем сервис</h1>
          <p className={styles.description}>
            Проверяем сессию и собираем интерфейс, чтобы сразу открыть сайт в правильном состоянии.
          </p>
        </div>

        <div aria-hidden="true" className={styles.progress}>
          <span className={styles.progressBar} />
        </div>
      </div>
    </div>
  );
};

export default AppBootScreen;
