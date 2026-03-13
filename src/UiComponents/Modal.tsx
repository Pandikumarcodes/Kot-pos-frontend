import { type ReactNode } from "react";
import { modal } from "./Token";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) return null;
  return (
    <div className={modal.overlay}>
      <div className={modal.panel}>
        <div className={modal.dragHandle}>
          <div className="w-10 h-1 rounded-full bg-kot-chart" />
        </div>
        <div className={modal.header}>
          <h2 className="text-lg font-bold text-kot-darker">{title}</h2>
          <button
            onClick={onClose}
            className="text-kot-text hover:text-kot-darker"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className={modal.body}>{children}</div>
      </div>
    </div>
  );
}
