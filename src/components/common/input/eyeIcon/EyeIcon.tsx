import EyeOff from "./assets/eye-off.svg?react";
import Eye from "./assets/eye.svg?react";
import "./styles.scss";

interface EyeIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: number;
  open?: boolean;
}
export default function EyeIcon({ size = 24, open, ...props }: EyeIconProps) {
  const { className = "", ...rest } = props;
  const Icon = open ? Eye : EyeOff;
  return (
    <span {...rest} className={`eye-icon eye-icon--${open ? "open" : "closed"} ${className}`}>
      <Icon width={size} height={size} />
    </span>
  );
}
