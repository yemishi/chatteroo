import "./styles.scss";
import { useToast } from "@/hooks";
import RemoveIcon from "@/assets/icons/close.svg?react";
import SystemIcon from "@/assets/icons/settings.svg?react";
import InfoIcon from "@/assets/icons/info.svg?react";
import SuccessIcon from "@/assets/icons/success.svg?react";
import { useEffect, useState } from "react";

export default function Toast() {
  const { list, removeToast } = useToast();
  const [isClosing, setIsClosing] = useState<string[]>([]);
  const iconMapped = {
    message: SystemIcon,
    error: RemoveIcon,
    success: SuccessIcon,
    info: InfoIcon,
  };
  const handleOnClose = (id: string) => {
    setIsClosing([...isClosing, id]);
    setTimeout(() => {
      removeToast(id);
    }, 100);
  };
  useEffect(() => {
    list.forEach((n) => {
      if (!isClosing.includes(n.id)) {
        const timeout = setTimeout(() => {
          handleOnClose(n.id);
        }, n.duration! - 100);
        return () => clearTimeout(timeout);
      }
    });
  }, [list, isClosing]);
  return (
    <div className="toast-list">
      {list.map((n) => {
        const Icon = iconMapped[n.type];
        const isToastClosing = isClosing.includes(n.id);

        return (
          <div
            key={n.id}
            onClick={n.onClick}
            className={`toast ${isToastClosing ? "toast__closing" : "toast__open"} ${`toast--${n.type}`}`}
          >
            {n.icon ? (
              <img className="toast__icon" src={n.icon} alt={`${n.title} toast icon`} />
            ) : (
              <Icon className="toast__icon" />
            )}
            <div className="toast-details">
              <h4 className="toast-details__title">{n.title}</h4>
              {n.message && (
                <p className="toast-details__message">{n.message.text ? n.message.text : "[Sent an image]"}</p>
              )}
            </div>
            <button
              aria-label="Close toast"
              className="toast__close"
              onClick={(e) => {
                e.stopPropagation();
                handleOnClose(n.id);
              }}
            >
              <RemoveIcon className="toast__close-icon" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
