import { useEffect } from "react";

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TITLE_ID = "confirmation-modal-title";

export function ConfirmationModal({ isOpen, onClose }: ConfirmationModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="confirmation-modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="confirmation-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={TITLE_ID}
      >
        <h2 id={TITLE_ID} className="confirmation-modal__title">
          Preferences saved
        </h2>
        <div className="confirmation-modal__body">
          <p>Most of the time, you won’t hear from us. That’s intentional.</p>
          <p>We’ll step in only when something meaningfully changes.</p>
        </div>
        <button
          type="button"
          className="button-primary confirmation-modal__button"
          onClick={onClose}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
