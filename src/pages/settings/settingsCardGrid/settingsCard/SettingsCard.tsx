import { Link } from "@tanstack/react-router";
import "./styles.scss";
export default function SettingsCard({
  title,
  description,
  to,
}: {
  title: string;
  description: string;
  to: "profile" | "upgrade__account";
}) {
  return (
    <Link className="settings-card" to={`/settings/${to}`}>
      <h3 className="settings-card__title">{title}</h3>
      <p className="settings-card__label">{description}</p>
    </Link>
  );
}
