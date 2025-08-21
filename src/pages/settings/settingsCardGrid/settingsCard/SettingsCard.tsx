import { Link } from "@tanstack/react-router";
import "./styles.scss";
import ArrowIcon from "@/assets/icons/arrow.svg?react";
export default function SettingsCard({
  title,
  description,
  to,
  onClick,
}: {
  title: string;
  description: string;
  to?: "profile" | "upgrade_account" | "update_tag" | "update_secret" | "update_email";
  onClick?: () => void;
}) {
  if (to)
    return (
      <Link onClick={onClick} className="settings-card" to={`/settings/${to}`}>
        <div className="settings-card__content">
          <h3 className="settings-card__content-title">{title}</h3>
          <p className="settings-card__content-description">{description}</p>
        </div>
        <button>
          <ArrowIcon className="settings-card__icon" />
        </button>
      </Link>
    );

  return (
    <button onClick={onClick} className="settings-card">
      <div className="settings-card__content">
        <h3 className="settings-card__content-title">{title}</h3>
        <p className="settings-card__content-description">{description}</p>
      </div>
    </button>
  );
}
