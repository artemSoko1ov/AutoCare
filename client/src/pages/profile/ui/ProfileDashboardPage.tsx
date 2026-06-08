import { useAppSelector } from "@app/providers/store/hooks";
import { createProfileDashboardData } from "@/entities/profile/model";
import ProfileFavorites from "@/widgets/profile-favorites";
import ProfileGarage from "@/widgets/profile-garage";
import ProfileOrders from "@/widgets/profile-orders";
import ProfileOverview from "@/widgets/profile-overview";
import ProfileReviews from "@/widgets/profile-reviews";
import styles from "./ProfileDashboardPage.module.scss";

const ProfileDashboardPage = () => {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const profileData = createProfileDashboardData(currentUser);

  return (
    <>
      <ProfileOverview
        editLabel={profileData.editLabel}
        profile={profileData.profile}
        stats={profileData.stats}
      />

      <div className={styles.dashboard}>
        <div className={styles.primaryColumn}>
          <ProfileOrders section={profileData.ordersSection} />
        </div>

        <div className={styles.secondaryColumn}>
          <ProfileGarage section={profileData.garageSection} />
          <ProfileFavorites section={profileData.favoritesSection} />
        </div>
      </div>

      <ProfileReviews section={profileData.reviewsSection} />
    </>
  );
};

export default ProfileDashboardPage;
