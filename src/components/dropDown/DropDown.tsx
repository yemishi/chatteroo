import "./style.scss";

import { useEffect, useRef, type HTMLAttributes, type MouseEvent, type ReactNode } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  onClose: () => void;
  isOpen: boolean;
}
export default function DropDown({ onClose, isOpen, className = "", children }: Props) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent | globalThis.MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={`${className} dropdown ${isOpen ? "open" : ""}`}>
      {children}
    </div>
  );
}
