import DropDown from "@/components/dropDown/DropDown";
import "./styles.scss";
import { getSession } from "@/helpers";
import { useState } from "react";
import NotificationIcon from "@/assets/icons/notification.svg?react";
import SignoutIcon from "@/assets/icons/sign-out.svg?react";
import SettingsIcon from "@/assets/icons/settings.svg?react";
import { authActions } from "@/lib/actions";

export default function UserOptions() {
  const user = getSession();
  const [isOpen, setIsOpen] = useState(false);
  const { signout } = authActions();

  return (
    <div className="user-options">
      <img
        className="user-options__avatar"
        onClick={() => setIsOpen(!isOpen)}
        src={user?.picture}
        alt={`${user?.username} picture`}
      />

      <DropDown isOpen={isOpen} onClose={() => setIsOpen(!isOpen)}>
        <div className="dropdown-option">
          <NotificationIcon className="dropdown-icon" />
          Notifications
        </div>
        <div className="dropdown-option">
          <SettingsIcon className="dropdown-icon" />
          Settings
        </div>
        <div onClick={() => signout.mutate()} className="dropdown-option logout">
          <SignoutIcon className="dropdown-icon" />
          Sign Out
        </div>
      </DropDown>
    </div>
  );
}
