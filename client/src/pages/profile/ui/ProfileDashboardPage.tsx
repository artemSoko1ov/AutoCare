import { useAppSelector } from "@app/providers/store/hooks";
import { createProfileGarageSection, useCarsQuery } from "@/entities/car";
import { createProfileDashboardData } from "@/entities/profile/model";
import { CarFormModal, useGarageManager } from "@/features/car/manage";
import ProfileFavorites from "@/widgets/profile-favorites";
import ProfileGarage from "@/widgets/profile-garage";
import ProfileOrders from "@/widgets/profile-orders";
import ProfileOverview from "@/widgets/profile-overview";
import ProfileReviews from "@/widgets/profile-reviews";
import styles from "./ProfileDashboardPage.module.scss";

const ProfileDashboardPage = () => {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const profileData = createProfileDashboardData(currentUser);
  const carsQuery = useCarsQuery();
  const garageSection = createProfileGarageSection(carsQuery.data ?? []);
  const garageManager = useGarageManager(carsQuery.data ?? []);

  const handleRetry = () => {
    void carsQuery.refetch();
  };

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
          <ProfileGarage
            errorMessage={carsQuery.isError ? "Не удалось загрузить автомобили." : null}
            feedback={garageManager.feedback}
            isLoading={carsQuery.isPending}
            onCreate={garageManager.openCreateModal}
            onRetry={handleRetry}
            section={garageSection}
          />
          <ProfileFavorites section={profileData.favoritesSection} />
        </div>
      </div>

      <ProfileReviews section={profileData.reviewsSection} />

      <CarFormModal
        car={garageManager.formCar}
        error={garageManager.formError}
        fieldErrors={garageManager.formFieldErrors}
        isOpen={garageManager.isFormModalOpen}
        isSubmitting={garageManager.isSubmitting}
        mode={garageManager.formMode}
        onClose={garageManager.closeModal}
        onFieldChange={garageManager.clearFormFieldError}
        onSubmit={garageManager.submitCarForm}
      />
    </>
  );
};

export default ProfileDashboardPage;
