import DropDown from "@/components/dropDown/DropDown";
import "./styles.scss";
import { useState } from "react";
import NotificationIcon from "@/assets/icons/notification.svg?react";
import SignoutIcon from "@/assets/icons/sign-out.svg?react";
import SettingsIcon from "@/assets/icons/settings.svg?react";
import { authActions } from "@/lib/actions";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks";

export default function UserOptions() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const { signout } = authActions();
  const close = () => setIsOpen(false);

  return (
    <div className="user-options">
      <img
        className="user-options__avatar"
        onClick={() => setIsOpen(!isOpen)}
        src={user?.picture}
        alt={`${user?.username} picture`}
      />

      <DropDown isOpen={isOpen} onClose={() => setIsOpen(!isOpen)}>
        <Link to="/notifications" className="dropdown-option">
          <NotificationIcon className="dropdown-icon dropdown-icon--notification" />
          Notifications
        </Link>

        <Link to="/" onClick={close} className="dropdown-option">
          <SettingsIcon className="dropdown-icon" />
          Settings
        </Link>

        <button onClick={() => signout.mutate()} className="dropdown-option logout">
          <SignoutIcon className="dropdown-icon" />
          Sign Out
        </button>
      </DropDown>
    </div>
  );
}
