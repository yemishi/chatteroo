import { useOverlay } from "@/hooks";
import "./styles.scss";

import { useRef, type HTMLAttributes, type ReactNode, type RefObject } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  onClose: () => void;
  isOpen: boolean;
  containerRef?: RefObject<HTMLDivElement | null>;
}
export default function DropDown({ onClose, isOpen, className = "", children, containerRef }: Props) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const extraRef = (containerRef ?? null) as RefObject<HTMLDivElement | null>;
  useOverlay({ isOpen, onClose, refs: [dropdownRef, extraRef] });

  return (
    <div ref={dropdownRef} className={`${className} dropdown ${isOpen ? "open" : ""}`}>
      {children}
    </div>
  );
}
