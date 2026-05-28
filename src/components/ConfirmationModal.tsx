import { useEffect } from "react";
import { postures, type PostureId } from "../logic/postures";

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  postureId: PostureId;
}

const TITLE_ID = "confirmation-modal-title";

export function ConfirmationModal({ isOpen, onClose, postureId }: ConfirmationModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const { bodyParagraphs } = postures[postureId];

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
          <p>{bodyParagraphs[0]}</p>
          <p>{bodyParagraphs[1]}</p>
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
