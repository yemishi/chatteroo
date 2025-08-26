import "./styles.scss";
import ArrowLeft from "@/assets/icons/arrow.svg?react";
import getOnlineUsers from "@/lib/getOnlineUsers";
import type { ChatMember } from "@/types";
import { useState } from "react";
import ChatOptions from "./chatOptions/ChatOptions";
import ChatViewMember from "./chatViewMember/ChatViewMember";

type Props = {
  onClose: () => void;
  userHighlight: ChatMember;
  toggleQuitChat: () => void;
};

export default function ChatHeader({ onClose, userHighlight, toggleQuitChat }: Props) {
  const onlineUsers = getOnlineUsers();
  const [isViewMember, setIsViewMember] = useState(false);
  return (
    <header className="chat-header">
      <button className="chat-header__close btn" onClick={onClose}>
        <ArrowLeft className="chat-header__close__icon" />
      </button>
      <div className="chat-header__info popover-container" onClick={() => setIsViewMember(true)}>
        <img
          src={userHighlight.picture}
          className={`${onlineUsers.includes(userHighlight.id) ? "online" : "offline"} chat-header__info__icon`}
          alt={`${userHighlight.username}'s profile picture`}
        />
        <p className="chat-header__info-username">{userHighlight.username}</p>
        <ChatViewMember onClose={() => setIsViewMember(false)} isOpen={isViewMember} member={userHighlight} />
      </div>

      <ChatOptions toggleQuitChat={toggleQuitChat} onViewProfile={() => setIsViewMember(true)} />
    </header>
  );
}
