import { useAppSelector } from "@app/providers/store/hooks";
import { createProfileGarageSection, useCarsQuery } from "@/entities/car";
import { createProfileOrdersSection, useOrdersQuery } from "@/entities/order";
import { createProfileDashboardData, createProfileOverviewStats } from "@/entities/profile/model";
import { createProfileReviewsSection, useMyReviewsQuery } from "@/entities/review";
import { CarFormModal, useGarageManager } from "@/features/car/manage";
import ProfileGarage from "@/widgets/profile-garage";
import ProfileOrders from "@/widgets/profile-orders";
import ProfileOverview from "@/widgets/profile-overview";
import ProfileReviews from "@/widgets/profile-reviews";
import styles from "./ProfileDashboardPage.module.scss";

const ProfileDashboardPage = () => {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const profileData = createProfileDashboardData(currentUser);
  const carsQuery = useCarsQuery();
  const ordersQuery = useOrdersQuery();
  const reviewsQuery = useMyReviewsQuery();
  const overviewStats = createProfileOverviewStats({
    orders: ordersQuery.data ?? [],
    reviewsCount: reviewsQuery.data?.length ?? 0,
  });
  const garageSection = createProfileGarageSection(carsQuery.data ?? []);
  const ordersSection = createProfileOrdersSection(ordersQuery.data ?? []);
  const reviewsSection = createProfileReviewsSection(reviewsQuery.data ?? []);
  const garageManager = useGarageManager(carsQuery.data ?? []);

  const handleRetry = () => {
    void carsQuery.refetch();
  };

  const handleOrdersRetry = () => {
    void ordersQuery.refetch();
  };

  const handleReviewsRetry = () => {
    void reviewsQuery.refetch();
  };

  return (
    <>
      <ProfileOverview
        editLabel={profileData.editLabel}
        profile={profileData.profile}
        stats={overviewStats}
      />

      <div className={styles.dashboard}>
        <div className={styles.primaryColumn}>
          <ProfileOrders
            errorMessage={ordersQuery.isError ? "Не удалось загрузить список заявок." : null}
            isLoading={ordersQuery.isPending}
            onRetry={handleOrdersRetry}
            section={ordersSection}
          />
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
        </div>
      </div>

      <ProfileReviews
        errorMessage={reviewsQuery.isError ? "Не удалось загрузить список ваших отзывов." : null}
        isLoading={reviewsQuery.isPending}
        onRetry={handleReviewsRetry}
        section={reviewsSection}
      />

      {garageManager.isFormModalOpen ? (
        <CarFormModal
          car={garageManager.formCar}
          error={garageManager.formError}
          fieldErrors={garageManager.formFieldErrors}
          isOpen
          isSubmitting={garageManager.isSubmitting}
          mode={garageManager.formMode}
          onClose={garageManager.closeModal}
          onFieldChange={garageManager.clearFormFieldError}
          onSubmit={garageManager.submitCarForm}
        />
      ) : null}
    </>
  );
};

export default ProfileDashboardPage;
