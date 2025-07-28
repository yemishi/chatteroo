import "./style.scss";
import { createPortal } from "react-dom";

import { useEffect, type HTMLAttributes, type MouseEvent, type ReactNode, type RefObject } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  onClose: () => void;
  ref: RefObject<HTMLDivElement>;
}
export default function Modal({ onClose, className = "", ref, children }: Props) {
  const modalRoot = document.getElementById("modal");

useEffect(() => {
  const originalStyle = window.getComputedStyle(document.body).overflow;
  document.body.style.overflow = "hidden";
  return () => {
    document.body.style.overflow = originalStyle;
  };
}, []);

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (e.target === e.currentTarget) onClose();
  };
  if (!modalRoot) return <div>Modal not found :/</div>;
  return createPortal(
    <div ref={ref} onClick={handleBackdropClick} className={`${className} modal`}>
      {children}
    </div>,
    modalRoot
  );
}
