export { default as CarDeleteModal } from "./ui/CarDeleteModal";
export { default as CarFormModal } from "./ui/CarFormModal";
export {
  getCarErrorMessage,
  getCarFieldErrors,
  useCreateCarMutation,
  useDeleteCarMutation,
  useUpdateCarMutation,
} from "./model/useCarMutations";
export { useGarageManager } from "./model/useGarageManager";
export type { GarageFeedback } from "./model/useGarageManager";
export type { CarFieldErrors } from "./model/useCarMutations";
