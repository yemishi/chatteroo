import "./style.scss";
import { createPortal } from "react-dom";

import { useEffect, useRef, type HTMLAttributes, type MouseEvent, type ReactNode, type RefObject } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  onClose: () => void;
  ref?: RefObject<HTMLDivElement>;
  isOpen?: boolean;
}
export default function Modal({ onClose, isOpen = true, className = "", ref, children }: Props) {
  const modalRoot = document.getElementById("modal");
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);
  useEffect(() => {
    window.history.pushState({ modal: true }, "");

    const handlePopState = () => {
      onClose();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (e.target === e.currentTarget) onClose();
  };
  if (!modalRoot) return <div>Modal not found :/</div>;
  return createPortal(
    <div
      ref={ref || containerRef}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      className={`${className} modal ${isOpen ? "modal-open" : ""}`}
    >
      {children}
    </div>,
    modalRoot,
  );
}
