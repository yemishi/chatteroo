import { Popover } from "@/components";
import { useState } from "react";

import MenuIcon from "@/assets/icons/menu.svg?react";
import QuitIcon from "@/assets/icons/sign-out.svg?react";
import ProfileIcon from "@/assets/icons/profile.svg?react";
type Props = {
  onViewProfile: () => void;
  toggleQuitChat: () => void;
};
export default function ChatOptions({ onViewProfile, toggleQuitChat }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="popover-container">
      <button className="btn" onClick={() => setIsOpen(!isOpen)}>
        <MenuIcon />
      </button>
      <Popover onClose={() => setIsOpen(false)} isOpen={isOpen}>
        <button
          className="popover-option"
          onClick={() => {
            setIsOpen(false);
            onViewProfile();
          }}
        >
          <ProfileIcon className="popover-icon --minimal" />
          View Profile
        </button>
        <button onClick={toggleQuitChat} className="popover-option">
          <QuitIcon className="popover-icon" />
          Quit Chat
        </button>
      </Popover>
    </div>
  );
}
