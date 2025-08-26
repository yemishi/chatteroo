import { useEffect, type RefObject } from "react";

export default function useOverlay(isOpen: boolean, onClose: () => void, refs: RefObject<HTMLElement | null>[]) {
  useEffect(() => {
    if (!isOpen) return;
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleClick = (e: MouseEvent) => {
      const clickedInside = refs.some((ref) => ref.current?.contains(e.target as Node));
      if (!clickedInside) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.body.style.overflow = originalStyle;
      document.removeEventListener("mousedown", handleClick);
    };
  }, [isOpen, refs, onClose]);
}
