import "./styles.scss";
import { Button } from "@/components";
import type { User } from "@/types";
import { useState } from "react";
import ProfileSettingsForm from "./userEditForm/UserEditForm";
import { ProfileOption } from "./profileOption/ProfileOption";
import UserUpgradeForm from "./userUpgradeForm/UserUpgradeForm";

type UserSettingsProps = {
  user: User;
};
export default function UserSettings({ user }: UserSettingsProps) {
  const [isEdit, setIsEdit] = useState(false);
  const [isUpgrade, setIsUpgrade] = useState(false);
  return (
    <div className="profile-settings">
      <img className="profile-settings__picture" src={user.picture} alt={`${user.username} picture`} />
      <p className="profile-settings__username">{user.username}</p>
      {user.bio && <p className="profile-settings__username">{user.bio}</p>}
      {user.guestCode && <p className="profile-settings__guestCode">{user.guestCode}</p>}
      <Button onClick={() => setIsEdit(true)}>Edit Profile</Button>

      <ProfileOption
        title="Upgrade account"
        description="Upgrade from a guest account to unlock more features and customization."
        onClick={() => setIsUpgrade(true)}
      />
      {isUpgrade && <UserUpgradeForm onClose={() => setIsUpgrade(false)} />}
      {isEdit && <ProfileSettingsForm onClose={() => setIsEdit(false)} user={user} />}
    </div>
  );
}
