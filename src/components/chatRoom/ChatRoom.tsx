import "./style.scss";
import { useAuth } from "@/context/AuthContext";
import useChat from "@/hooks/useChat";
import { getMessages } from "@/lib/actions";
import type { Chat } from "@/types";
import { useEffect, useRef, useState } from "react";
import Modal from "../modal/Modal";
import { formatTime } from "@/helpers";

export default function ChatRoom({ chatInfo, onClose }: { chatInfo: Chat; onClose: () => void }) {
  const { user: currUser } = useAuth();
  const { values = [], hasNextPage, isFetchingNextPage, fetchNextPage } = getMessages(chatInfo.id);
  const { messages, sendMessage } = useChat(chatInfo.id);

  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [scrollCorrection, setScrollCorrection] = useState<null | {
    prevHeight: number;
    prevScrollTop: number;
  }>(null);

  const loadOlderMessages = () => {
    if (containerRef.current) {
      const prevHeight = containerRef.current.scrollHeight;
      const prevScrollTop = containerRef.current.scrollTop;

      setScrollCorrection({ prevHeight, prevScrollTop });

      fetchNextPage();
    }
  };

  useEffect(() => {
    if (scrollCorrection && containerRef.current) {
      const newHeight = containerRef.current.scrollHeight;
      const scrollDiff = newHeight - scrollCorrection.prevHeight;

      containerRef.current.scrollTop = scrollCorrection.prevScrollTop + scrollDiff;
      setScrollCorrection(null);
    }
  }, [values]);

  useEffect(() => {
    setIsOpen(true);
    setTimeout(() => {
      containerRef.current?.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "auto",
      });
    }, 200);
  }, []);
  const allMessages = [...values, ...messages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const handleSend = () => {
    if (!message.trim()) return;

    sendMessage(
      { content: message, room: chatInfo.id, senderId: currUser?.id! },
      chatInfo.members.map((m) => m.id)
    );
    setMessage("");
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  const scrollToBottom = () => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };
  const user = chatInfo.members[0];

  return (
    <Modal
      ref={containerRef as React.RefObject<HTMLDivElement>}
      onClose={handleClose}
      className={`chat-container ${isOpen ? "open" : ""}`}
    >
      <header className="chat-header">
        <button onClick={handleClose}>&lt;</button>
        <div className="user-info">
          <img src={user.picture} alt={`${user.username}'s profile picture`} />
          <p>{user.username}</p>
        </div>
        <button>...</button>
      </header>

      {hasNextPage && (
        <div onClick={loadOlderMessages}>{isFetchingNextPage ? "Loading..." : "Load older messages"}</div>
      )}

      <div className="messages-container">
        {allMessages.map((msg, i) => {
          const isMe = msg.senderId === currUser?.id;
          return (
            <div
              className={`message ${isMe ? "sent" : "received"}`}
              key={`${msg.timestamp}_${i}`}
              onClick={() => console.log(msg)}
            >
              <div className="message-content">{msg.content}</div>
              <span className="message-time">{formatTime(msg.timestamp.toString())}</span>
            </div>
          );
        })}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>S</button>
      </div>
    </Modal>
  );
}
