import "./styles.scss";
import ArrowLeft from "@/assets/icons/arrow-left.svg?react";
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
      <button onClick={onClose}>
        <ArrowLeft />
      </button>
      <div className="chat-user-info">
        <img
          src={picture}
          className={onlineUsers.includes(id) ? "online" : "offline"}
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
