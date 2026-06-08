import Button from "@/shared/ui/Button";
import Modal from "@/shared/ui/Modal";
import styles from "./CarDeleteModal.module.scss";

type CarDeleteModalProps = {
  carName: string;
  error?: string | null;
  isDeleting?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
};

const CarDeleteModal = ({
  carName,
  error = null,
  isDeleting = false,
  isOpen,
  onClose,
  onConfirm,
}: CarDeleteModalProps) => {
  return (
    <Modal
      description="Это действие удалит автомобиль из вашего профиля."
      isOpen={isOpen}
      onClose={onClose}
      title="Удалить автомобиль"
    >
      <div className={styles.body}>
        <p className={styles.text}>
          Вы действительно хотите удалить автомобиль{" "}
          <span className={styles.carName}>{carName}</span>?
        </p>

        {error ? <div className={styles.error}>{error}</div> : null}

        <div className={styles.actions}>
          <Button
            disabled={isDeleting}
            onClick={onClose}
            size="md"
            type="button"
            variant="secondary"
          >
            Отмена
          </Button>
          <Button loading={isDeleting} onClick={onConfirm} size="md" type="button">
            Удалить
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CarDeleteModal;
