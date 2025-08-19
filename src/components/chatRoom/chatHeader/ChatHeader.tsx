import "./styles.scss";
import ArrowLeft from "@/assets/icons/arrow.svg?react";
import MenuIcon from "@/assets/icons/menu.svg?react";
import getOnlineUsers from "@/lib/getOnlineUsers";
import type { ChatMember } from "@/types";

type Props = {
  onClose: () => void;
  userHighlight: ChatMember;
};

export default function ChatHeader({ onClose, userHighlight: { picture, username, id } }: Props) {
  const onlineUsers = getOnlineUsers();
  return (
    <header className="chat-header">
      <button className="chat-header__close" onClick={onClose}>
        <ArrowLeft className="chat-header__close__icon" />
      </button>
      <div className="chat-header__info">
        <img
          src={picture}
          className={`${onlineUsers.includes(id) ? "online" : "offline"} chat-header__info__icon`}
          alt={`${username}'s profile picture`}
        />
        <p>{username}</p>
      </div>
      <button>
        <MenuIcon />
      </button>
    </header>
  );
}
