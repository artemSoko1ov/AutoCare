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

      <CarDeleteModal
        carName={garageManager.deleteTargetName}
        error={garageManager.deleteError}
        isDeleting={garageManager.isDeleting}
        isOpen={garageManager.isDeleteModalOpen}
        onClose={garageManager.closeModal}
        onConfirm={garageManager.confirmDelete}
      />
    </>
  );
};

export default ProfileCarsPage;
