import "./styles.scss";
import type { HTMLAttributes, ReactNode } from "react";

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: "primary" | "secondary" | "danger";
}

export default function Button({ children, variant = "primary", ...props }: ButtonProps) {
  const { className = "", ...rest } = props;
  return (
    <button className={`button button-${variant} ${className} `} {...rest}>
      {children}
    </button>
  );
}
