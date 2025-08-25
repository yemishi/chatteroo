import "./styles.scss";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import ArrowLeft from "@/assets/icons/arrow.svg?react";
import SendIcon from "@/assets/icons/send.svg?react";
import type { Chat } from "@/types";

import Modal from "../modal/Modal";
import Messages from "./messages/Messages";
import ChatHeader from "./chatHeader/ChatHeader";
import { useAuth, useChatRoom } from "@/hooks";

type Props = {
  chatInfo: Chat;
  onClose: () => void;
  scrollPositions: Record<string, number>;
  setScrollPositions: Dispatch<SetStateAction<Record<string, number>>>;
};

export default function ChatRoom({ chatInfo, onClose, scrollPositions, setScrollPositions }: Props) {
  const { user } = useAuth();
  if (!user) return;

  const {
    containerRef,
    handleSend,
    scrollToBottom,
    showScrollButton,
    values,
    isFetchingNextPage,
    currMember,
    hasUnreadMessage,
  } = useChatRoom({
    chatInfo,
    scrollPositions,
    setScrollPositions,
    user,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    if (containerRef.current)
      setScrollPositions({ ...scrollPositions, [chatInfo.id]: containerRef.current?.scrollTop! });
    setTimeout(() => {
      onClose();
    }, 300);
  };
  const sendMessage = () => {
    if (!message.trim()) return;
    handleSend(message.trim());
    setMessage("");
  };

  return (
    <Modal
      ref={containerRef as React.RefObject<HTMLDivElement>}
      onClose={handleClose}
      isOpen={isOpen}
      className="chat-modal"
    >
      <ChatHeader onClose={handleClose} userHighlight={chatInfo.highlight} />

      {isFetchingNextPage && <div>Loading older messages</div>}
      <Messages messages={values} members={chatInfo.members} currMember={currMember!} highLight={chatInfo.highlight} />
      <div className="chat-room__type-area">
        <button
          onClick={scrollToBottom}
          className={`chat-room__scroll-action ${hasUnreadMessage ? "badged" : ""} ${
            showScrollButton ? "show" : "hide"
          }`}
        >
          <ArrowLeft className="chat-room__scroll-action__icon" />
        </button>

        <input
          type="text"
          name="message"
          className="primary-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button onClick={sendMessage}>
          <SendIcon />
        </button>
      </div>
    </Modal>
  );
}
