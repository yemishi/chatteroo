import { useEffect, type RefObject } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  refs: RefObject<HTMLElement | null>[];
  autoClose?: boolean;
};
export default function useOverlay({ isOpen, onClose, refs, autoClose = true }: Props) {
  useEffect(() => {
    if (!isOpen) return;
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleClick = (e: MouseEvent) => {
      const clickedInside = refs.some((ref) => ref.current?.contains(e.target as Node));
      if (!clickedInside && autoClose) {
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
