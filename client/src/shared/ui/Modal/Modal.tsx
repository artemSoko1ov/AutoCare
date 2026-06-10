import { type MouseEvent, type ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import Icon from "@/shared/ui/Icon";
import styles from "./Modal.module.scss";

type ModalProps = {
  isOpen: boolean;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  onClose: () => void;
};

const Modal = ({ actions, children, description, isOpen, onClose, title }: ModalProps) => {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className={styles.backdrop} onClick={handleBackdropClick} role="presentation">
      <div
        aria-modal="true"
        className={clsx("surface", "surface--glass", styles.modal)}
        role="dialog"
      >
        <div className={styles.header}>
          <div className={styles.headerBody}>
            <h2 className={styles.title}>{title}</h2>
            {description && <p className={styles.description}>{description}</p>}
          </div>

          <button
            aria-label="Закрыть модальное окно"
            className={styles.close}
            onClick={onClose}
            type="button"
          >
            <span className={styles.closeIcon}>
              <Icon name="x-mark" />
            </span>
          </button>
        </div>

        <div className={styles.body}>{children}</div>

        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
