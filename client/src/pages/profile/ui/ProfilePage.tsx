import { Outlet } from "react-router-dom";
import { useAppSelector } from "@app/providers/store/hooks";
import { createProfileDashboardData } from "@/entities/profile/model";
import PageBreadcrumbs from "@/widgets/page-breadcrumbs";
import ProfileSidebar from "@/widgets/profile-sidebar";
import styles from "./ProfilePage.module.scss";

const ProfilePage = () => {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const profileData = createProfileDashboardData(currentUser);

  return (
    <section className={`section page-shell page-shell--accent ${styles.page}`}>
      <div className="container">
        <div className={styles.pageHeader}>
          <PageBreadcrumbs />
          <h1 className={styles.pageTitle}>{profileData.pageTitle}</h1>
          <p className={styles.pageDescription}>
            Управляйте профилем, автомобилями, заявками и избранными услугами в одном месте.
          </p>
        </div>

        <div className={styles.shell}>
          <div className={styles.sidebarColumn}>
            <ProfileSidebar items={profileData.sidebarItems} />
          </div>

          <div className={styles.content}>
            <Outlet />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
