import "./styles.scss";
import type { User } from "@/types";
import SettingsCard from "./settingsCard/SettingsCard";

type SettingsCardGridProps = {
  user: User;
};
export default function SettingsCardGrid({ user }: SettingsCardGridProps) {
  return (
    <div className="settings-card-grid">
      <SettingsCard
        title="Edit Profile"
        description="Change your profile picture, display name, and bio."
        to="profile"
      />

      <SettingsCard
        title="Upgrade account"
        description="Upgrade from a guest account to unlock more features and customization."
        to="upgrade__account"
      />
    </div>
  );
}
