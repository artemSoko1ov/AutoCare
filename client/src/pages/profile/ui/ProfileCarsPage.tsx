import { createProfileCarsSection, useCarsQuery } from "@/entities/car";
import { CarDeleteModal, CarFormModal, useGarageManager } from "@/features/car/manage";
import ProfileCars from "@/widgets/profile-cars";

const ProfileCarsPage = () => {
  const carsQuery = useCarsQuery();
  const section = createProfileCarsSection(carsQuery.data ?? []);
  const garageManager = useGarageManager(carsQuery.data ?? []);

  const handleRetry = () => {
    void carsQuery.refetch();
  };

  return (
    <>
      <ProfileCars
        errorMessage={carsQuery.isError ? "Не удалось загрузить список автомобилей." : null}
        feedback={garageManager.feedback}
        isLoading={carsQuery.isPending}
        onCreate={garageManager.openCreateModal}
        onDelete={garageManager.openDeleteModal}
        onEdit={garageManager.openEditModal}
        onRetry={handleRetry}
        section={section}
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

      {garageManager.isDeleteModalOpen ? (
        <CarDeleteModal
          carName={garageManager.deleteTargetName}
          error={garageManager.deleteError}
          isDeleting={garageManager.isDeleting}
          isOpen
          onClose={garageManager.closeModal}
          onConfirm={garageManager.confirmDelete}
        />
      ) : null}
    </>
  );
};

export default ProfileCarsPage;
