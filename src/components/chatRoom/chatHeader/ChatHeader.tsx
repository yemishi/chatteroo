import "./styles.scss";
import arrowLeft from "@/assets/icons/arrow-left.svg";
import menuIcon from "@/assets/icons/menu.svg";
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
        <img className="chat-icon" src={arrowLeft} alt="arrow left" />
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
        <img className="chat-icon" src={menuIcon} alt="menu icon" />
      </button>
    </header>
  );
}
