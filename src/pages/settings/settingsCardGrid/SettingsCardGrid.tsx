import "./styles.scss";
import type { User } from "@/types";
import SettingsCard from "./settingsCard/SettingsCard";
import { useState } from "react";
import DeleteAccount from "../deleteAccount/DeleteAccount";

type SettingsCardGridProps = {
  user: User;
};
export default function SettingsCardGrid({ user }: SettingsCardGridProps) {
  const [isDeleteAcc, setIsDeleteAcc] = useState(false);
  return (
    <div className="settings-card-grid">
      {user.guestCode && (
        <SettingsCard
          title="Upgrade account"
          description="Upgrade from a guest account to unlock more features and customization."
          to="upgrade_account"
        />
      )}
      {!user.guestCode && (
        <>
          <SettingsCard
            title="Edit Profile"
            description="Change your profile picture, display name, and bio."
            to="profile"
          />
          <SettingsCard
            title="Update Tag"
            description="Change your unique tag so friends can find you easily."
            to="update_tag"
          />
          <SettingsCard
            title="Update email"
            description="Keep your account up to date by updating your email address."
            to="update_email"
          />

          <SettingsCard
            title="Update Secret"
            description="Update your secret to keep your account secure."
            to="update_secret"
          />
        </>
      )}
      <SettingsCard
        title="Delete Account"
        description="Update your secret to keep your account secure."
        onClick={() => setIsDeleteAcc(true)}
      />
      {isDeleteAcc && <DeleteAccount user={user} onClose={() => setIsDeleteAcc(false)} />}
    </div>
  );
}
