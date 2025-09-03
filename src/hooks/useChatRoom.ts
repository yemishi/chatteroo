import { getMessages, markChatAsRead } from "@/lib/actions";
import type { Chat, User } from "@/types";
import useChat from "./useChat";
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";

type Props = {
  user: User;
  chatInfo: Chat;
  scrollPositions: Record<string, number>;
  setScrollPositions: Dispatch<SetStateAction<Record<string, number>>>;
};

export default function useChatRoom({ user, chatInfo, scrollPositions, setScrollPositions }: Props) {
  const { values = [], hasNextPage, fetchNextPage, isFetchingNextPage } = getMessages(chatInfo.id);
  const { messages, sendMessage } = useChat(chatInfo.id);
  const { mutateAsync: markChatAsReadMutate, data: lastTimeReadData } = markChatAsRead();

  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [scrollCorrection, setScrollCorrection] = useState<null | { prevHeight: number; prevScrollTop: number }>(null);

  const sortedMessages = [...values, ...messages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const currMember = chatInfo.members.find((m) => m.id === user.id)!;
  const lastOtherUserMsg = [...sortedMessages].reverse().find((msg) => msg.senderId !== user.id);
  const lastMessageReadAt = lastTimeReadData?.lastMessageReadAt
    ? new Date(lastTimeReadData?.lastMessageReadAt)
    : new Date(currMember?.lastMessageReadAt || 0);

  const hasUnreadMessage = lastOtherUserMsg && lastMessageReadAt < new Date(lastOtherUserMsg.timestamp);

  const updateReadTime = async () => {
    try {
      const result = await markChatAsReadMutate(chatInfo.id);
      currMember.lastMessageReadAt = new Date(result.lastMessageReadAt);
    } catch (error) {
      console.error(error);
    }
  };
  const loadOlderMessages = () => {
    if (containerRef.current) {
      const prevHeight = containerRef.current.scrollHeight;
      const prevScrollTop = containerRef.current.scrollTop;

      setScrollCorrection({ prevHeight, prevScrollTop });

      fetchNextPage();
    }
  };

  const handleSend = async (message: { text?: string; imgs: string[] }) => {
    sendMessage(
      {
        content: message,
        room: chatInfo.id,
        senderId: user.id!,
        senderPicture: user.picture!,
        senderName: user.username!,
      },
      chatInfo.members.map((m) => m.id)
    );
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  const scrollToBottom = () =>
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });

  // maintain scroll positions when older messages load
  useEffect(() => {
    if (scrollCorrection && containerRef.current) {
      const newHeight = containerRef.current.scrollHeight;
      const scrollDiff = newHeight - scrollCorrection.prevHeight;
      containerRef.current.scrollTop = scrollCorrection.prevScrollTop + scrollDiff;
      setScrollCorrection(null);
    }
  }, [values]);

  // restore saved scroll or default to bottom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const saved = scrollPositions[chatInfo.id];
    if (typeof saved === "number") {
      container.scrollTo({ top: saved, behavior: "auto" });
      return;
    }

    const timeout = setTimeout(() => {
      container.scrollTo({ top: container.scrollHeight, behavior: "auto" });
    }, 125);
    return () => clearTimeout(timeout);
  }, []);

  // scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
    if (isAtBottom && hasUnreadMessage) {
      updateReadTime();
    }

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      const isNearTop = scrollTop < 100;

      setShowScrollButton(!isAtBottom);
      setScrollPositions((prev) => ({
        ...prev,
        [chatInfo.id]: scrollTop,
      }));

      if (hasNextPage && isNearTop) loadOlderMessages();
      if (isAtBottom && hasUnreadMessage) updateReadTime();
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, hasUnreadMessage, chatInfo.id, setScrollPositions]);

  return {
    containerRef,
    values: sortedMessages,
    handleSend,
    scrollToBottom,
    isFetchingNextPage,
    showScrollButton,
    currMember,
    hasUnreadMessage,
  };
}
