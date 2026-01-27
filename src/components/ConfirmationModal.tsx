import { useEffect } from 'react';
import type { Posture } from '../logic/postures';

export interface ConfirmationModalProps {
  posture: Posture;
  isOpen: boolean;
  onClose: () => void;
}

export function ConfirmationModal({ posture, isOpen, onClose }: ConfirmationModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={posture.title}
      >
        <h2 className="modal-title">{posture.title}</h2>
        <p className="modal-message">{posture.message}</p>
        <button type="button" className="modal-button" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  );
}
