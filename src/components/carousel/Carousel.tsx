import { type HTMLAttributes, type ReactNode, useEffect, useRef } from "react";
import "./styles.scss";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode | ReactNode[];
}
export default function App({ children, ...props }: Props) {
  const { className = "", ...rest } = props;
  const slider = useRef<HTMLDivElement | null>(null);
  const isDown = useRef<boolean>(false);
  const startX = useRef<number>(0);
  const scrollLeft = useRef<number>(0);

  useEffect(() => {
    const el = slider.current;
    if (!el) return;

    const handleMouseDown = (e: MouseEvent) => {
      isDown.current = true;
      el.classList.add("dragging");
      startX.current = e.pageX - el.offsetLeft;
      scrollLeft.current = el.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown.current = false;
      el.classList.remove("dragging");
    };

    const handleMouseUp = () => {
      isDown.current = false;
      el.classList.remove("dragging");
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown.current) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = x - startX.current;
      el.scrollLeft = scrollLeft.current - walk;
    };

    el.addEventListener("mousedown", handleMouseDown);
    el.addEventListener("mouseleave", handleMouseLeave);
    el.addEventListener("mouseup", handleMouseUp);
    el.addEventListener("mousemove", handleMouseMove);

    return () => {
      el.removeEventListener("mousedown", handleMouseDown);
      el.removeEventListener("mouseleave", handleMouseLeave);
      el.removeEventListener("mouseup", handleMouseUp);
      el.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div {...rest} className={`items ${className}`} ref={slider}>
      {children}
    </div>
  );
}
