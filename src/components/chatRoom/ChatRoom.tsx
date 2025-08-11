import "./styles.scss";
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import ArrowLeft from "@/assets/icons/arrow-left.svg?react";
import SendIcon from "@/assets/icons/send.svg?react";
import type { Chat } from "@/types";

import { useAuth } from "@/context/AuthContext";
import useChat from "@/hooks/useChat";
import { getMessages } from "@/lib/actions";
import Modal from "../modal/Modal";
import Messages from "./messages/Messages";
import ChatHeader from "./chatHeader/ChatHeader";

type Props = {
  chatInfo: Chat;
  onClose: () => void;
  scrollPositions: Record<string, number>;
  setScrollPositions: Dispatch<SetStateAction<Record<string, number>>>;
};

export default function ChatRoom({ chatInfo, onClose, scrollPositions, setScrollPositions }: Props) {
  const { user: currUser } = useAuth();
  const { values = [], hasNextPage, fetchNextPage, isFetchingNextPage } = getMessages(chatInfo.id);
  const { messages, sendMessage } = useChat(chatInfo.id);

  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const [scrollCorrection, setScrollCorrection] = useState<null | {
    prevHeight: number;
    prevScrollTop: number;
  }>(null);

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

    const container = containerRef.current;
    const savedScrollTop = scrollPositions[chatInfo.id];
    if (!container) return;

    if (savedScrollTop && typeof savedScrollTop === "number" && values) {
      container.scrollTo({
        top: savedScrollTop,
        behavior: "auto",
      });
      return;
    }
    const timeout = setTimeout(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "auto",
      });
    }, 200);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;

      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      const isNearTop = scrollTop < 100;
      setShowScrollButton(!isAtBottom);
      setScrollPositions({ ...scrollPositions, [chatInfo.id]: containerRef.current?.scrollTop! });

      if (hasNextPage && isNearTop) loadOlderMessages();
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [hasNextPage]);

  const loadOlderMessages = () => {
    if (containerRef.current) {
      const prevHeight = containerRef.current.scrollHeight;
      const prevScrollTop = containerRef.current.scrollTop;

      setScrollCorrection({ prevHeight, prevScrollTop });

      fetchNextPage();
    }
  };

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
    if (containerRef.current)
      setScrollPositions({ ...scrollPositions, [chatInfo.id]: containerRef.current?.scrollTop! });
    setTimeout(() => {
      onClose();
    }, 300);
  };
  const sortedMessages = [...values, ...messages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <Modal
      ref={containerRef as React.RefObject<HTMLDivElement>}
      onClose={handleClose}
      className={`chat-modal ${isOpen ? "open" : ""}`}
    >
      <ChatHeader onClose={handleClose} userHighlight={chatInfo.members[0]} />

      {isFetchingNextPage && <div>Loading older messages</div>}
      <Messages currUser={currUser!} messages={sortedMessages} members={chatInfo.members} />
      <div className="chat-modal_input-area">
        <button onClick={scrollToBottom} className={`chat-modal__scroll-button ${showScrollButton ? "show" : "hide"}`}>
          <ArrowLeft />
        </button>

        <input
          type="text"
          name="message"
          className="primary-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>
          <SendIcon />
        </button>
      </div>
    </Modal>
  );
}
