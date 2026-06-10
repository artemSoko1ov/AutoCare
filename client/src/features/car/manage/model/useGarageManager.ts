import { useMemo, useState } from "react";
import type { CarDto, CreateCarBody } from "@shared/contracts/cars";
import type { CarFieldErrors } from "./useCarMutations";
import {
  getCarErrorMessage,
  getCarFieldErrors,
  useCreateCarMutation,
  useDeleteCarMutation,
  useUpdateCarMutation,
} from "./useCarMutations";

type GarageModalState =
  | { type: "create" }
  | { type: "edit"; carId: string }
  | { type: "delete"; carId: string }
  | null;

export type GarageFeedback = {
  tone: "success" | "error";
  message: string;
};

const getCarName = (car: CarDto | null) => {
  if (!car) {
    return "автомобиль";
  }

  return `${car.brand} ${car.model}`.trim();
};

export const useGarageManager = (cars: CarDto[]) => {
  const [modalState, setModalState] = useState<GarageModalState>(null);
  const [feedback, setFeedback] = useState<GarageFeedback | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formFieldErrors, setFormFieldErrors] = useState<CarFieldErrors>({});
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const createMutation = useCreateCarMutation();
  const updateMutation = useUpdateCarMutation();
  const deleteMutation = useDeleteCarMutation();

  const selectedCar = useMemo(() => {
    if (!modalState || modalState.type === "create") {
      return null;
    }

    return cars.find((car) => car.id === modalState.carId) ?? null;
  }, [cars, modalState]);

  const closeModal = () => {
    setModalState(null);
    setFormError(null);
    setFormFieldErrors({});
    setDeleteError(null);
  };

  const clearFormFieldError = (field: keyof CreateCarBody) => {
    setFormFieldErrors((currentState) => ({
      ...currentState,
      [field]: undefined,
    }));
    setFormError(null);
  };

  const openCreateModal = () => {
    setFeedback(null);
    setFormError(null);
    setFormFieldErrors({});
    setModalState({ type: "create" });
  };

  const openEditModal = (carId: string) => {
    setFeedback(null);
    setFormError(null);
    setFormFieldErrors({});
    setModalState({ type: "edit", carId });
  };

  const openDeleteModal = (carId: string) => {
    setFeedback(null);
    setDeleteError(null);
    setModalState({ type: "delete", carId });
  };

  const submitCarForm = async (data: CreateCarBody) => {
    setFormError(null);
    setFormFieldErrors({});

    try {
      if (modalState?.type === "edit" && selectedCar) {
        await updateMutation.mutateAsync({
          carId: selectedCar.id,
          data,
        });

        setFeedback({
          tone: "success",
          message: `${getCarName(selectedCar)} обновлен`,
        });
      } else {
        const createdCar = await createMutation.mutateAsync(data);

        setFeedback({
          tone: "success",
          message: `${getCarName(createdCar)} добавлен в гараж`,
        });
      }

      closeModal();
    } catch (error) {
      const { fieldErrors, validationErrors } = getCarFieldErrors(error);

      if (validationErrors.length > 0) {
        setFormFieldErrors(fieldErrors);
        setFormError("Проверьте введенные данные");
        return;
      }

      setFormError(getCarErrorMessage(error, "Не удалось сохранить автомобиль"));
    }
  };

  const confirmDelete = async () => {
    if (!selectedCar) {
      return;
    }

    setDeleteError(null);

    try {
      await deleteMutation.mutateAsync(selectedCar.id);
      setFeedback({
        tone: "success",
        message: `${getCarName(selectedCar)} удален из гаража`,
      });
      closeModal();
    } catch (error) {
      setDeleteError(getCarErrorMessage(error, "Не удалось удалить автомобиль"));
    }
  };

  return {
    clearFormFieldError,
    closeModal,
    confirmDelete,
    deleteError,
    deleteTargetName: getCarName(selectedCar),
    feedback,
    formCar: selectedCar,
    formError,
    formFieldErrors,
    formMode: (modalState?.type === "edit" ? "edit" : "create") as "create" | "edit",
    isDeleteModalOpen: modalState?.type === "delete",
    isDeleting: deleteMutation.isPending,
    isFormModalOpen: modalState?.type === "create" || modalState?.type === "edit",
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    openCreateModal,
    openDeleteModal,
    openEditModal,
    submitCarForm,
  };
};
