import { useOverlay } from "@/hooks";
import "./styles.scss";

import { useRef, type HTMLAttributes, type ReactNode } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  onClose: () => void;
  isOpen: boolean;
  autoClose?: boolean;
  variant?: "primary" | "secondary";
}
export default function Popover({ onClose, isOpen, className = "", children, autoClose, variant = "primary" }: Props) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  useOverlay({ isOpen, onClose, refs: [dropdownRef], autoClose });

  return (
    <div ref={dropdownRef} className={`${className} popover popover-${variant} ${isOpen ? "open" : ""}`}>
      {children}
    </div>
  );
}
