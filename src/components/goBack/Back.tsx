import { useRouter } from "@tanstack/react-router";
import ArrowIcon from "@/assets/icons/arrow.svg?react";
import "./styles.scss";
export default function Back() {
  const router = useRouter();
  const onClick = () => router.history.back();
  return (
    <button onClick={onClick} className="go-back">
      <ArrowIcon className="go-back__icon" />
    </button>
  );
}
